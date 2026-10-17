import { DatabaseSync, backup } from "node:sqlite";
import { mkdirSync, chmodSync } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

export function openDatabase(filename) {
  mkdirSync(path.dirname(filename), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(filename);
  chmodSync(filename, 0o600);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = FULL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS waitlist_entries (
      id INTEGER PRIMARY KEY,
      fingerprint TEXT NOT NULL UNIQUE,
      business_name TEXT NOT NULL CHECK(length(business_name) BETWEEN 2 AND 100),
      business_type TEXT NOT NULL CHECK(business_type IN ('Taquería','Hamburguesería','Heladería','Sushi','Otro')),
      contact_name TEXT NOT NULL CHECK(length(contact_name) BETWEEN 2 AND 100),
      email TEXT NOT NULL CHECK(length(email) BETWEEN 3 AND 254),
      whatsapp TEXT NOT NULL CHECK(length(whatsapp) = 13),
      city TEXT NOT NULL CHECK(length(city) BETWEEN 2 AND 100),
      neighborhood TEXT NOT NULL DEFAULT '' CHECK(length(neighborhood) <= 100),
      landing_path TEXT NOT NULL,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_content TEXT,
      utm_term TEXT,
      consent_version TEXT NOT NULL DEFAULT 'waitlist-v1',
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
    CREATE INDEX IF NOT EXISTS waitlist_created_at ON waitlist_entries(created_at);
    PRAGMA user_version = 1;
  `);
  return db;
}

export function saveEntry(db, entry) {
  const fingerprint = createHash("sha256")
    .update(
      [
        entry.email,
        entry.businessName.toLocaleLowerCase("es"),
        entry.city.toLocaleLowerCase("es"),
      ].join("\0"),
    )
    .digest("hex");
  const result = db
    .prepare(
      `
    INSERT INTO waitlist_entries (
      fingerprint, business_name, business_type, contact_name, email, whatsapp,
      city, neighborhood, landing_path, utm_source, utm_medium, utm_campaign,
      utm_content, utm_term
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(fingerprint) DO NOTHING
  `,
    )
    .run(
      fingerprint,
      entry.businessName,
      entry.businessType,
      entry.contactName,
      entry.email,
      entry.whatsapp,
      entry.city,
      entry.neighborhood,
      entry.attribution.landing_path,
      ...[
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
      ].map((key) => entry.attribution[key] || null),
    );
  return { created: Number(result.changes) === 1 };
}

export async function backupDatabase(db, destination) {
  mkdirSync(path.dirname(destination), { recursive: true, mode: 0o700 });
  await backup(db, destination);
  chmodSync(destination, 0o600);
}
