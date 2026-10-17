import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { openDatabase, backupDatabase } from "../server/database.mjs";
import { createApp } from "../server/app.mjs";

const origin = "http://127.0.0.1:4321";
const entry = {
  businessName: "  Tacos de prueba  ",
  businessType: "Taquería",
  contactName: " Persona de prueba ",
  email: "EXAMPLE@example.test",
  whatsapp: "+525512345678",
  city: " Ciudad de México ",
  neighborhood: " Coyoacán ",
  intent: "waitlist",
  website: "",
  attribution: {
    landing_path: "/videos-para-taquerias/",
    utm_source: "instagram",
    utm_medium: "paid_social",
    utm_campaign: "waitlist",
    utm_content: "taco_reel",
    utm_term: "no_people",
    unknown: "ignored",
  },
};

async function fixture(options = {}) {
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), "hooksage-api-"));
  const staticDir = path.join(folder, "dist");
  await fs.mkdir(staticDir);
  await fs.writeFile(path.join(staticDir, "index.html"), "<h1>Hooksage</h1>");
  await fs.writeFile(path.join(folder, ".env"), "never-public");
  const filename = path.join(folder, "data/waitlist.sqlite");
  const db = openDatabase(filename);
  const errors = [];
  const server = createApp({
    db,
    staticDir,
    origins: [origin],
    rateLimit: 100,
    logger: { error: (value) => errors.push(value) },
    ...options,
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  const post = (body = entry, overrides = {}) =>
    fetch(`${url}/api/waitlist`, {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      ...overrides,
    });
  return {
    db,
    filename,
    folder,
    url,
    post,
    errors,
    async close() {
      await new Promise((resolve) => server.close(resolve));
      try {
        db.close();
      } catch {}
      await fs.rm(folder, { recursive: true, force: true });
    },
  };
}

test("A real HTTP submission commits all seven fields and attribution; retries do not duplicate or overwrite", async () => {
  const f = await fixture();
  try {
    const res = await f.post();
    assert.equal(res.status, 201);
    assert.deepEqual(await res.json(), { ok: true, created: true });
    const row = f.db.prepare("SELECT * FROM waitlist_entries").get();
    assert.equal(row.business_name, "Tacos de prueba");
    assert.equal(row.business_type, "Taquería");
    assert.equal(row.contact_name, "Persona de prueba");
    assert.equal(row.email, "example@example.test");
    assert.equal(row.whatsapp, entry.whatsapp);
    assert.equal(row.city, "Ciudad de México");
    assert.equal(row.neighborhood, "Coyoacán");
    assert.equal(row.landing_path, entry.attribution.landing_path);
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ])
      assert.equal(row[key], entry.attribution[key]);
    assert.equal(row.consent_version, "waitlist-v1");
    assert.ok(Number.isFinite(Date.parse(row.created_at)));
    const retries = await Promise.all(
      Array.from({ length: 8 }, () =>
        f.post({ ...entry, contactName: "Must not overwrite" }),
      ),
    );
    for (const retry of retries)
      assert.deepEqual(await retry.json(), { ok: true, created: false });
    assert.equal(
      f.db.prepare("SELECT count(*) AS n FROM waitlist_entries").get().n,
      1,
    );
    assert.equal(
      f.db.prepare("SELECT contact_name FROM waitlist_entries").get()
        .contact_name,
      "Persona de prueba",
    );
    assert.equal((await fs.stat(f.filename)).mode & 0o777, 0o600);
    assert.ok(!(await res.text().catch(() => "")).includes(entry.email));
  } finally {
    await f.close();
  }
});

test("Committed entries survive closing/reopening and a consistent SQLite backup", async () => {
  const f = await fixture();
  try {
    assert.equal((await f.post()).status, 201);
    const destination = path.join(f.folder, "backup/waitlist.sqlite");
    await backupDatabase(f.db, destination);
    f.db.close();
    const reopened = openDatabase(f.filename);
    assert.equal(
      reopened.prepare("SELECT count(*) AS n FROM waitlist_entries").get().n,
      1,
    );
    reopened.close();
    const copy = openDatabase(destination);
    assert.equal(
      copy.prepare("SELECT business_name FROM waitlist_entries").get()
        .business_name,
      "Tacos de prueba",
    );
    copy.close();
  } finally {
    await f.close();
  }
});

test("Server rejects invalid fields, honeypots, foreign origins and unsupported content before inserting", async () => {
  const f = await fixture();
  try {
    for (const patch of [
      { email: "invalid" },
      { businessType: "Admin" },
      { whatsapp: "+15551234567" },
      { businessName: "x" },
      { city: "x" },
      { contactName: "x" },
      { neighborhood: "x".repeat(101) },
      { intent: "payment" },
      { website: "spam.example" },
    ])
      assert.equal((await f.post({ ...entry, ...patch })).status, 400);
    assert.equal((await f.post(null)).status, 400);
    assert.equal(
      (
        await f.post(entry, {
          headers: {
            Origin: "https://attacker.example",
            "Content-Type": "application/json",
          },
        })
      ).status,
      403,
    );
    assert.equal(
      (await f.post(entry, { headers: { "Content-Type": "application/json" } }))
        .status,
      403,
    );
    assert.equal(
      (
        await f.post(entry, {
          headers: { Origin: origin, "Content-Type": "text/plain" },
        })
      ).status,
      415,
    );
    assert.equal((await f.post(entry, { body: "{" })).status, 400);
    assert.equal((await f.post(entry, { body: "x".repeat(9000) })).status, 413);
    assert.equal(
      f.db.prepare("SELECT count(*) AS n FROM waitlist_entries").get().n,
      0,
    );
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("x".repeat(9000)));
        controller.close();
      },
    });
    assert.equal(
      (await f.post(entry, { body: stream, duplex: "half" })).status,
      413,
    );
    const preflight = await fetch(f.url + "/api/waitlist", {
      method: "OPTIONS",
      headers: { Origin: origin },
    });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get("access-control-allow-origin"), origin);
    assert.equal(
      (await fetch(f.url + "/api/waitlist", { headers: { Origin: origin } }))
        .status,
      405,
    );
  } finally {
    await f.close();
  }
});

test("Prepared statements preserve SQL-like names; unsafe campaign data is discarded", async () => {
  const f = await fixture();
  try {
    const name = "Tacos'); DROP TABLE waitlist_entries;--";
    assert.equal(
      (
        await f.post({
          ...entry,
          businessName: name,
          attribution: {
            landing_path: "/?email=private",
            utm_source: "person@example.test",
            utm_campaign: "valid_label",
          },
        })
      ).status,
      201,
    );
    const row = f.db.prepare("SELECT * FROM waitlist_entries").get();
    assert.equal(row.business_name, name);
    assert.equal(row.landing_path, "/");
    assert.equal(row.utm_source, null);
    assert.equal(row.utm_campaign, "valid_label");
  } finally {
    await f.close();
  }
});

test("Request bursts are limited and database failures never produce a success or log personal data", async () => {
  const f = await fixture({ rateLimit: 2 });
  try {
    f.db.close();
    assert.equal((await f.post()).status, 503);
    assert.equal((await f.post()).status, 503);
    const limited = await f.post();
    assert.equal(limited.status, 429);
    assert.equal(limited.headers.get("retry-after"), "900");
    assert.deepEqual(f.errors, [
      "waitlist_save_failed",
      "waitlist_save_failed",
    ]);
  } finally {
    await f.close();
  }
});

test("Only built assets are public; no database, secrets, traversal or symlink access", async () => {
  const f = await fixture();
  try {
    await fs.symlink(f.filename, path.join(f.folder, "dist", "leak.sqlite"));
    assert.match(await (await fetch(f.url)).text(), /Hooksage/);
    for (const name of [
      "/data/waitlist.sqlite",
      "/.env",
      "/%2eenv",
      "/server/index.mjs",
      "/leak.sqlite",
      "/api/entries",
    ])
      assert.equal((await fetch(f.url + name)).status, 404);
    assert.deepEqual(await (await fetch(f.url + "/healthz")).json(), {
      ok: true,
    });
  } finally {
    await f.close();
  }
});
