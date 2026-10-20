import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { openDatabase, backupDatabase } from "../server/database.mjs";
import { createApp } from "../server/app.mjs";
import { DatabaseSync } from "node:sqlite";
import { createHash } from "node:crypto";
import { saveEntry } from "../server/database.mjs";
import { validateEntry } from "../server/validation.mjs";
import { createNotifier } from "../server/notify.mjs";

const origin = "http://127.0.0.1:4321";

test("Video streams support byte ranges, suffixes, seeking and HEAD; subtitles use the correct MIME type", async () => {
  const f = await fixture();
  try {
    const media = Buffer.from(Array.from({ length: 4096 }, (_, i) => i % 251));
    await fs.writeFile(path.join(f.folder, "dist/sample.mp4"), media);
    await fs.writeFile(path.join(f.folder, "dist/sample.vtt"), "WEBVTT\n");
    const full = await fetch(f.url + "/sample.mp4");
    assert.equal(full.status, 200);
    assert.equal(full.headers.get("content-type"), "video/mp4");
    assert.equal(full.headers.get("accept-ranges"), "bytes");
    assert.deepEqual(Buffer.from(await full.arrayBuffer()), media);
    for (const [range, start, end] of [
      ["bytes=2-7", 2, 7],
      ["bytes=4000-", 4000, 4095],
      ["bytes=-16", 4080, 4095],
      ["bytes=4090-9999", 4090, 4095],
      ["bytes=-9999", 0, 4095],
    ]) {
      const res = await fetch(f.url + "/sample.mp4", {
        headers: { Range: range },
      });
      assert.equal(res.status, 206);
      assert.equal(
        res.headers.get("content-range"),
        "bytes " + start + "-" + end + "/4096",
      );
      assert.equal(Number(res.headers.get("content-length")), end - start + 1);
      assert.deepEqual(
        Buffer.from(await res.arrayBuffer()),
        media.subarray(start, end + 1),
      );
    }
    for (const range of [
      "bytes=4096-",
      "bytes=9-2",
      "bytes=-0",
      "bytes=-",
      "bytes=1-2,5-6",
      "bytes=999999999999999999999-",
    ]) {
      const res = await fetch(f.url + "/sample.mp4", {
        headers: { Range: range },
      });
      assert.equal(res.status, 416);
      assert.equal(res.headers.get("content-range"), "bytes */4096");
      assert.equal((await res.arrayBuffer()).byteLength, 0);
    }
    const head = await fetch(f.url + "/sample.mp4", {
      method: "HEAD",
      headers: { Range: "bytes=0-1" },
    });
    assert.equal(head.status, 200);
    assert.equal(head.headers.get("content-length"), "4096");
    assert.equal((await head.arrayBuffer()).byteLength, 0);
    const subtitle = await fetch(f.url + "/sample.vtt");
    assert.equal(
      subtitle.headers.get("content-type"),
      "text/vtt; charset=utf-8",
    );
    assert.equal(await subtitle.text(), "WEBVTT\n");
    assert.deepEqual(f.errors, []);
  } finally {
    await f.close();
  }
});
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

test("New entries email the team once; email failures never fail the submission", async () => {
  const sent = [];
  const notifier = createNotifier({
    apiKey: "re_test",
    to: "team@example.test",
    fetch: async (url, init) => {
      sent.push({ url, init });
      return { ok: sent.length === 1 };
    },
  });
  const f = await fixture({ notify: notifier });
  try {
    assert.equal((await f.post()).status, 201);
    assert.equal((await f.post()).status, 200);
    assert.equal((await f.post({ ...entry, city: "Puebla" })).status, 201);
    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.equal(sent.length, 2);
    assert.equal(sent[0].url, "https://api.resend.com/emails");
    assert.equal(sent[0].init.headers.Authorization, "Bearer re_test");
    const body = JSON.parse(sent[0].init.body);
    assert.deepEqual(body.to, ["team@example.test"]);
    assert.equal(body.reply_to, "example@example.test");
    assert.match(body.subject, /Tacos de prueba/);
    assert.match(body.text, /WhatsApp: \+525512345678/);
    assert.match(body.text, /utm_source: instagram/);
    assert.deepEqual(f.errors, ["waitlist_notify_failed"]);
    assert.equal(
      f.db.prepare("SELECT count(*) AS n FROM waitlist_entries").get().n,
      2,
    );
  } finally {
    await f.close();
  }
  assert.equal(createNotifier({ apiKey: "", to: "x@example.test" }), null);
});

test("Native HTML forms save and deduplicate entries without exposing submitted values", async () => {
  const f = await fixture();
  const fields = { ...entry, whatsapp: "55 1234 5678", landing_path: "/" };
  delete fields.attribution;
  const body = new URLSearchParams(fields).toString();
  const headers = {
    Origin: origin,
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "text/html,application/xhtml+xml",
  };
  try {
    for (const expected of [201, 200]) {
      const response = await f.post(undefined, { headers, body });
      assert.equal(response.status, expected);
      assert.match(response.headers.get("content-type"), /text\/html/);
      assert.equal(response.headers.get("cache-control"), "no-store");
      const html = await response.text();
      assert.match(html, /Recibimos tu solicitud/);
      assert.doesNotMatch(
        html,
        /EXAMPLE@example.test|Tacos de prueba|5512345678/,
      );
      assert.equal(response.headers.get("location"), null);
    }
    const row = f.db.prepare("SELECT * FROM waitlist_entries").get();
    assert.equal(row.whatsapp, "+525512345678");
    assert.equal(row.email, "example@example.test");
    assert.equal(row.landing_path, "/");
    assert.equal(
      f.db.prepare("SELECT count(*) AS n FROM waitlist_entries").get().n,
      1,
    );
  } finally {
    await f.close();
  }
});

test("Native forms preserve validation, origin checks, limits and honest failure responses", async () => {
  const f = await fixture();
  const fields = { ...entry, whatsapp: "55 1234 5678", landing_path: "/" };
  delete fields.attribution;
  const headers = {
    Origin: origin,
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "text/html",
  };
  const encode = (patch) =>
    new URLSearchParams({ ...fields, ...patch }).toString();
  try {
    for (const [body, status, extra] of [
      [encode({ email: "invalid" }), 400],
      [encode({ whatsapp: "+1 555 123 4567" }), 400],
      [encode({ website: "spam.example" }), 400],
      [
        encode({ businessName: "<script>private-marker</script>", city: "x" }),
        400,
      ],
      [encode({}) + "&email=second@example.test", 400],
      ["businessName=" + "x".repeat(9000), 413],
      [encode({}), 403, { ...headers, Origin: "https://attacker.example" }],
      [
        encode({}),
        403,
        { "Content-Type": headers["Content-Type"], Accept: "text/html" },
      ],
    ]) {
      const response = await f.post(undefined, {
        headers: extra || headers,
        body,
      });
      assert.equal(response.status, status);
      const html = await response.text();
      assert.match(html, /No pudimos completar/);
      assert.doesNotMatch(
        html,
        /Recibimos tu solicitud|private-marker|EXAMPLE@example.test/,
      );
    }
    assert.equal(
      f.db.prepare("SELECT count(*) AS n FROM waitlist_entries").get().n,
      0,
    );
    f.db.close();
    const unavailable = await f.post(undefined, { headers, body: encode({}) });
    assert.equal(unavailable.status, 503);
    assert.doesNotMatch(await unavailable.text(), /Recibimos tu solicitud/);
  } finally {
    await f.close();
  }
  const limited = await fixture({ rateLimit: 1 });
  try {
    assert.equal(
      (await limited.post(undefined, { headers, body: encode({}) })).status,
      201,
    );
    const response = await limited.post(undefined, {
      headers,
      body: encode({}),
    });
    assert.equal(response.status, 429);
    assert.match(await response.text(), /Esperá unos minutos/);
    assert.ok(response.headers.get("retry-after"));
  } finally {
    await limited.close();
  }
});

test("Schema v1 migrates losslessly with a private snapshot and supports both countries and old tabs", async () => {
  const folder = await fs.mkdtemp(
    path.join(os.tmpdir(), "hooksage-migration-"),
  );
  const filename = path.join(folder, "waitlist.sqlite");
  let db;
  try {
    db = new DatabaseSync(filename);
    db.exec(
      await fs.readFile(
        new URL("./fixtures/waitlist-v1.sql", import.meta.url),
        "utf8",
      ),
    );
    const legacy = validateEntry(entry);
    // The historic fingerprint must keep deduplicating already submitted browser tabs.
    const fingerprint = createHash("sha256")
      .update(
        [
          legacy.email,
          legacy.businessName.toLocaleLowerCase("es"),
          legacy.city.toLocaleLowerCase("es"),
        ].join("\0"),
      )
      .digest("hex");
    db.prepare(
      "INSERT INTO waitlist_entries (fingerprint, business_name, business_type, contact_name, email, whatsapp, city, neighborhood, landing_path, utm_source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    ).run(
      fingerprint,
      legacy.businessName,
      legacy.businessType,
      legacy.contactName,
      legacy.email,
      legacy.whatsapp,
      legacy.city,
      legacy.neighborhood,
      legacy.attribution.landing_path,
      legacy.attribution.utm_source,
    );
    const original = db.prepare("SELECT * FROM waitlist_entries").get();
    db.close();
    db = openDatabase(filename);
    assert.equal(db.prepare("PRAGMA user_version").get().user_version, 4);
    const migrated = db.prepare("SELECT * FROM waitlist_entries").get();
    const { country, language, footage_url, editing_feedback, ...preserved } =
      migrated;
    assert.equal(footage_url, "");
    assert.equal(editing_feedback, "");
    assert.equal(language, "es");
    assert.equal(country, "MX");
    assert.deepEqual(preserved, { ...original });
    assert.equal(saveEntry(db, legacy).created, false);
    const snapshots = (await fs.readdir(folder)).filter((name) =>
      name.includes("before-v4"),
    );
    assert.equal(snapshots.length, 1);
    const snapshot = path.join(folder, snapshots[0]);
    assert.equal((await fs.stat(snapshot)).mode & 0o777, 0o600);
    const copy = new DatabaseSync(snapshot, { readOnly: true });
    assert.deepEqual(
      copy.prepare("SELECT * FROM waitlist_entries").get(),
      original,
    );
    assert.equal(copy.prepare("PRAGMA user_version").get().user_version, 1);
    copy.close();
    for (const [country, whatsapp, businessType] of [
      ["UY", "", "Startup"],
      ["AR", "+54 9 11 1234 5678", "Marca personal"],
    ]) {
      assert.equal(
        saveEntry(
          db,
          validateEntry({ ...entry, country, whatsapp, businessType }),
        ).created,
        true,
      );
    }
    db.close();
    db = openDatabase(filename);
    assert.equal(
      db.prepare("SELECT count(*) AS n FROM waitlist_entries").get().n,
      3,
    );
    assert.equal(
      (await fs.readdir(folder)).filter((name) => name.includes("before-v4"))
        .length,
      1,
    );
    assert.equal(
      db.prepare("PRAGMA integrity_check").get().integrity_check,
      "ok",
    );
  } finally {
    db?.close();
    await fs.rm(folder, { recursive: true, force: true });
  }
});

test("Uruguay and Argentina accept optional phones in JSON and native forms; invalid country and phone combinations are rejected", async () => {
  const f = await fixture();
  try {
    for (const country of ["UY", "AR"]) {
      for (const native of [false, true]) {
        const input = {
          ...entry,
          country,
          businessName: `QA ${country} ${native}`,
          businessType: "Startup",
          whatsapp: "",
        };
        const response = native
          ? await f.post(undefined, {
              headers: {
                Origin: origin,
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "text/html",
              },
              body: new URLSearchParams({
                ...input,
                attribution: "",
                landing_path: "/",
              }).toString(),
            })
          : await f.post(input);
        assert.equal(response.status, 201);
        const row = f.db
          .prepare(
            "SELECT country, whatsapp, consent_version FROM waitlist_entries WHERE business_name = ?",
          )
          .get(input.businessName);
        assert.deepEqual(
          { ...row },
          { country, whatsapp: "", consent_version: "waitlist-v2" },
        );
      }
    }
    for (const [country, phone, normalized] of [
      ["UY", "+598 99 123 456", "+59899123456"],
      ["AR", "+54 9 11 1234 5678", "+5491112345678"],
    ]) {
      assert.equal(
        (
          await f.post({
            ...entry,
            country,
            businessName: `QA phone ${country}`,
            businessType: "Pyme",
            whatsapp: phone,
          })
        ).status,
        201,
      );
      assert.equal(
        f.db
          .prepare(
            "SELECT whatsapp FROM waitlist_entries WHERE business_name = ?",
          )
          .get(`QA phone ${country}`).whatsapp,
        normalized,
      );
    }
    for (const patch of [
      { country: "" },
      { country: "US" },
      { country: "UY", whatsapp: "+5491112345678" },
      { country: "AR", whatsapp: "+59899123456" },
      { country: "UY", whatsapp: "99123456" },
    ]) {
      const invalid = { ...entry, businessType: "Startup", ...patch };
      assert.equal((await f.post(invalid)).status, 400);
      assert.equal(
        (
          await f.post(undefined, {
            headers: {
              Origin: origin,
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "text/html",
            },
            body: new URLSearchParams({
              ...invalid,
              attribution: "",
            }).toString(),
          })
        ).status,
        400,
      );
    }
    assert.equal(
      f.db.prepare("SELECT count(*) AS n FROM waitlist_entries").get().n,
      6,
    );
  } finally {
    await f.close();
  }
});

test("Old niche URLs redirect to the new landing and retain campaign parameters", async () => {
  const f = await fixture();
  try {
    for (const slug of [
      "taquerias",
      "hamburgueserias",
      "heladerias",
      "sushi",
    ]) {
      const response = await fetch(
        `${f.url}/videos-para-${slug}/?utm_source=instagram`,
        { redirect: "manual" },
      );
      assert.equal(response.status, 301);
      assert.equal(response.headers.get("location"), "/?utm_source=instagram");
    }
  } finally {
    await f.close();
  }
});

test("Schema v2 migration preserves every existing field and country, adds Spanish as the historical language and snapshots privately", async () => {
  const folder = await fs.mkdtemp(
    path.join(os.tmpdir(), "hooksage-v2-migration-"),
  );
  const filename = path.join(folder, "waitlist.sqlite");
  let db;
  try {
    db = new DatabaseSync(filename);
    db.exec(
      await fs.readFile(
        new URL("./fixtures/waitlist-v2.sql", import.meta.url),
        "utf8",
      ),
    );
    const old = {
      ...entry,
      country: "UY",
      businessName: "Existing startup",
      businessType: "Startup",
      email: "existing@example.test",
      whatsapp: "",
      city: "Montevideo",
    };
    const fingerprint = createHash("sha256")
      .update(
        [
          old.email,
          old.businessName.toLocaleLowerCase("es"),
          old.city.toLocaleLowerCase("es"),
          old.country,
        ].join("\0"),
      )
      .digest("hex");
    db.prepare(
      "INSERT INTO waitlist_entries (fingerprint,business_name,business_type,contact_name,email,whatsapp,city,neighborhood,landing_path,country) VALUES (?,?,?,?,?,?,?,?,?,?)",
    ).run(
      fingerprint,
      old.businessName,
      old.businessType,
      "Existing contact",
      old.email,
      old.whatsapp,
      old.city,
      "",
      "/",
      old.country,
    );
    const original = db.prepare("SELECT * FROM waitlist_entries").get();
    db.close();
    db = openDatabase(filename);
    assert.equal(db.prepare("PRAGMA user_version").get().user_version, 4);
    const { language, footage_url, editing_feedback, ...preserved } = db
      .prepare("SELECT * FROM waitlist_entries")
      .get();
    assert.equal(language, "es");
    assert.deepEqual(preserved, { ...original });
    assert.equal(
      saveEntry(
        db,
        validateEntry({
          ...old,
          contactName: "Existing contact",
          language: "en",
        }),
      ).created,
      false,
    );
    const snapshots = (await fs.readdir(folder)).filter((name) =>
      name.includes("before-v4"),
    );
    assert.equal(snapshots.length, 1);
    const snapshot = path.join(folder, snapshots[0]);
    assert.equal((await fs.stat(snapshot)).mode & 0o777, 0o600);
    const copy = new DatabaseSync(snapshot, { readOnly: true });
    assert.deepEqual(
      copy.prepare("SELECT * FROM waitlist_entries").get(),
      original,
    );
    assert.equal(copy.prepare("PRAGMA user_version").get().user_version, 2);
    copy.close();
    for (const country of ["US", "GB"])
      assert.equal(
        saveEntry(
          db,
          validateEntry({
            ...entry,
            businessName: "New " + country,
            businessType: "Startup",
            country,
            whatsapp: "",
            language: "en",
          }),
        ).created,
        true,
      );
    db.close();
    db = openDatabase(filename);
    assert.equal(
      db.prepare("SELECT count(*) AS n FROM waitlist_entries").get().n,
      3,
    );
    assert.equal(
      (await fs.readdir(folder)).filter((name) => name.includes("before-v4"))
        .length,
      1,
    );
    assert.equal(
      db.prepare("PRAGMA integrity_check").get().integrity_check,
      "ok",
    );
  } finally {
    db?.close();
    await fs.rm(folder, { recursive: true, force: true });
  }
});

test("US and UK submissions retain English contact preference, normalize phones and confirm native forms in English", async () => {
  const f = await fixture();
  try {
    for (const [country, whatsapp, normalized] of [
      ["US", "+1 202 555 0123", "+12025550123"],
      ["GB", "+44 7700 900123", "+447700900123"],
    ]) {
      for (const native of [false, true]) {
        const input = {
          ...entry,
          businessName: "English " + country + " " + native,
          businessType: "Pyme",
          country,
          whatsapp,
          language: "en",
        };
        const response = native
          ? await f.post(undefined, {
              headers: {
                Origin: origin,
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "text/html",
              },
              body: new URLSearchParams({
                ...input,
                attribution: "",
                landing_path: "/en/",
              }).toString(),
            })
          : await f.post(input);
        assert.equal(response.status, 201);
        if (native) {
          const html = await response.text();
          assert.match(html, /<html lang="en">/);
          assert.match(html, /We received your request/);
          assert.ok(html.includes('href="/en/"'));
          assert.doesNotMatch(html, /Ya estás|English US|example.test/);
        }
        const row = f.db
          .prepare(
            "SELECT country,whatsapp,language FROM waitlist_entries WHERE business_name=?",
          )
          .get(input.businessName);
        assert.deepEqual(
          { ...row },
          { country, whatsapp: normalized, language: "en" },
        );
      }
      assert.equal(
        (
          await f.post({
            ...entry,
            businessName: "No phone " + country,
            businessType: "Startup",
            country,
            whatsapp: "",
            language: "en",
          })
        ).status,
        201,
      );
    }
    for (const patch of [
      { country: "UK", whatsapp: "" },
      { country: "US", whatsapp: "+447700900123" },
      { country: "GB", whatsapp: "+12025550123" },
      { country: "US", whatsapp: "+1 111 111 1111" },
      { country: "GB", whatsapp: "+44 123" },
      { language: "de", country: "US", whatsapp: "" },
    ]) {
      assert.equal(
        (
          await f.post({
            ...entry,
            businessType: "Startup",
            language: "en",
            ...patch,
          })
        ).status,
        400,
      );
    }
    const invalid = await f.post(undefined, {
      headers: {
        Origin: origin,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "text/html",
      },
      body: new URLSearchParams({
        ...entry,
        country: "US",
        language: "en",
        email: "invalid",
      }).toString(),
    });
    assert.equal(invalid.status, 400);
    const html = await invalid.text();
    assert.match(html, /Check the form fields/);
    assert.doesNotMatch(html, /Revisá|Ya estás/);
  } finally {
    await f.close();
  }
});

test("Trial links and editing feedback survive JSON/native submission; existing leads can add them once without another lead", async () => {
  const sent = [];
  const f = await fixture({
    notify: async (e) => {
      sent.push(e);
    },
  });
  try {
    assert.equal((await f.post()).status, 201);
    const detail = {
      ...entry,
      footageUrl: "https://drive.google.com/file/d/fixture/view",
      editingFeedback: "Corregir subtítulos.\nRehacer los cortes.",
    };
    const res = await f.post(detail);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true, created: false });
    assert.equal((await f.post(detail)).status, 200);
    const row = f.db.prepare("SELECT * FROM waitlist_entries").get();
    assert.equal(row.footage_url, detail.footageUrl);
    assert.equal(row.editing_feedback, detail.editingFeedback);
    assert.equal(row.contact_name, "Persona de prueba");
    assert.equal(
      f.db.prepare("SELECT count(*) AS n FROM waitlist_entries").get().n,
      1,
    );
    assert.equal(sent.length, 2);
    assert.equal(sent[1].requestUpdate, true);
    assert.equal(sent[1].footageUrl, detail.footageUrl);
    const changed = {
      ...detail,
      footageUrl: "https://example.test/replacement",
      contactName: "Do not replace",
    };
    assert.equal((await f.post(changed)).status, 200);
    assert.equal(sent.length, 2);
    assert.equal(
      f.db.prepare("SELECT footage_url FROM waitlist_entries").get()
        .footage_url,
      detail.footageUrl,
    );
    const native = {
      ...detail,
      businessName: "Native trial",
      language: "en",
      landing_path: "/en/",
      attribution: "",
    };
    const nativeRes = await f.post(undefined, {
      headers: {
        Origin: origin,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "text/html",
      },
      body: new URLSearchParams(native).toString(),
    });
    assert.equal(nativeRes.status, 201);
    const nativeHtml = await nativeRes.text();
    assert.match(nativeHtml, /We received your request/);
    assert.doesNotMatch(nativeHtml, /drive.google.com|Corregir subtítulos/);
    const copy = f.db
      .prepare(
        "SELECT footage_url, editing_feedback FROM waitlist_entries WHERE business_name=?",
      )
      .get("Native trial");
    assert.equal(copy.footage_url, detail.footageUrl);
    assert.equal(copy.editing_feedback, detail.editingFeedback);
    const emails = [];
    const notifier = createNotifier({
      apiKey: "re_mock",
      to: "team@example.test",
      fetch: async (url, init) => {
        emails.push({ url, body: JSON.parse(init.body) });
        return { ok: true };
      },
    });
    await notifier(validateEntry(detail));
    assert.equal(emails[0].url, "https://api.resend.com/emails");
    assert.match(emails[0].body.text, /drive.google.com/);
    assert.match(emails[0].body.text, /Rehacer los cortes/);
  } finally {
    await f.close();
  }
});

test("Trial fields reject unsafe protocols, credentials, controls and excessive text without saving", async () => {
  const f = await fixture();
  try {
    for (const patch of [
      { footageUrl: "javascript:alert(1)" },
      { footageUrl: "http://example.test/clip" },
      { footageUrl: "https://user:password@example.test/clip" },
      { footageUrl: "https://example.test/" + "x".repeat(2048) },
      { footageUrl: 42 },
      { editingFeedback: "x".repeat(1001) },
      { editingFeedback: "hidden\u0000text" },
      { editingFeedback: [] },
    ])
      assert.equal((await f.post({ ...entry, ...patch })).status, 400);
    assert.equal(
      f.db.prepare("SELECT count(*) AS n FROM waitlist_entries").get().n,
      0,
    );
  } finally {
    await f.close();
  }
});

test("Schema v3 upgrades to v4 with a private snapshot, preserving every existing field and language", async () => {
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), "hooksage-v3-trial-"));
  const filename = path.join(folder, "waitlist.sqlite");
  let db;
  try {
    db = new DatabaseSync(filename);
    const v3Fixture = (
      await fs.readFile(
        new URL("./fixtures/waitlist-v2.sql", import.meta.url),
        "utf8",
      )
    ).replace("('UY','AR','MX')", "('UY','AR','MX','US','GB')");
    db.exec(v3Fixture);
    db.exec(
      "ALTER TABLE waitlist_entries ADD COLUMN language TEXT NOT NULL DEFAULT 'es'; PRAGMA user_version=3;",
    );
    db.prepare(
      "INSERT INTO waitlist_entries (fingerprint,business_name,business_type,contact_name,email,whatsapp,city,neighborhood,landing_path,country,language) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
    ).run(
      "v3-fixture",
      "Existing team",
      "Startup",
      "Existing person",
      "old@example.test",
      "",
      "London",
      "",
      "/en/",
      "GB",
      "en",
    );
    const before = db.prepare("SELECT * FROM waitlist_entries").get();
    db.close();
    db = openDatabase(filename);
    assert.equal(db.prepare("PRAGMA user_version").get().user_version, 4);
    const { footage_url, editing_feedback, ...preserved } = db
      .prepare("SELECT * FROM waitlist_entries")
      .get();
    assert.deepEqual(preserved, { ...before });
    assert.equal(footage_url, "");
    assert.equal(editing_feedback, "");
    assert.equal(
      db.prepare("PRAGMA integrity_check").get().integrity_check,
      "ok",
    );
    db.close();
    db = openDatabase(filename);
    const snapshots = (await fs.readdir(folder)).filter((n) =>
      n.includes("before-v4"),
    );
    assert.equal(snapshots.length, 1);
    const snapshot = path.join(folder, snapshots[0]);
    assert.equal((await fs.stat(snapshot)).mode & 0o777, 0o600);
    const copy = new DatabaseSync(snapshot, { readOnly: true });
    assert.equal(copy.prepare("PRAGMA user_version").get().user_version, 3);
    assert.deepEqual(
      copy.prepare("SELECT * FROM waitlist_entries").get(),
      before,
    );
    copy.close();
  } finally {
    db?.close();
    await fs.rm(folder, { recursive: true, force: true });
  }
});
