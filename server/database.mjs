import { DatabaseSync, backup } from "node:sqlite";
import { mkdirSync, chmodSync } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const schema = `CREATE TABLE waitlist_entries (
  id INTEGER PRIMARY KEY,
  fingerprint TEXT NOT NULL UNIQUE,
  business_name TEXT NOT NULL CHECK(length(business_name) BETWEEN 2 AND 100),
  business_type TEXT NOT NULL CHECK(length(business_type) BETWEEN 2 AND 100),
  contact_name TEXT NOT NULL CHECK(length(contact_name) BETWEEN 2 AND 100),
  email TEXT NOT NULL CHECK(length(email) BETWEEN 3 AND 254),
  whatsapp TEXT NOT NULL DEFAULT '' CHECK(whatsapp = '' OR length(whatsapp) BETWEEN 10 AND 16),
  city TEXT NOT NULL CHECK(length(city) BETWEEN 2 AND 100),
  neighborhood TEXT NOT NULL DEFAULT '' CHECK(length(neighborhood) <= 100),
  landing_path TEXT NOT NULL,
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, utm_content TEXT, utm_term TEXT,
  consent_version TEXT NOT NULL DEFAULT 'waitlist-v2',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  country TEXT NOT NULL DEFAULT 'MX' CHECK(country IN ('UY','AR','MX'))
)`;

export function openDatabase(filename) {
  mkdirSync(path.dirname(filename), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(filename);
  chmodSync(filename, 0o600);
  try {
    db.exec(
      "PRAGMA journal_mode = WAL; PRAGMA synchronous = FULL; PRAGMA busy_timeout = 5000;",
    );
    const version = db.prepare("PRAGMA user_version").get().user_version;
    if (version > 2) throw new Error("Unsupported database schema version");
    const exists = db
      .prepare(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name='waitlist_entries'",
      )
      .get();
    if (exists && version < 2) {
      // Snapshot the original database on the same private volume before any schema change.
      const snapshot = `${filename}.before-v2-${Date.now()}.sqlite`;
      db.exec(`VACUUM INTO '${snapshot.replaceAll("'", "''")}'`);
      chmodSync(snapshot, 0o600);
      db.exec("BEGIN IMMEDIATE");
      try {
        db.exec("ALTER TABLE waitlist_entries RENAME TO waitlist_entries_v1");
        db.exec(schema);
        db.exec(`INSERT INTO waitlist_entries SELECT *, 'MX' FROM waitlist_entries_v1;
          DROP TABLE waitlist_entries_v1;
          CREATE INDEX waitlist_created_at ON waitlist_entries(created_at);
          PRAGMA user_version = 2; COMMIT;`);
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
    } else if (!exists) {
      db.exec(
        `BEGIN IMMEDIATE; ${schema}; CREATE INDEX waitlist_created_at ON waitlist_entries(created_at); PRAGMA user_version = 2; COMMIT;`,
      );
    }
    return db;
  } catch (error) {
    db.close();
    throw error;
  }
}

export function saveEntry(db, entry) {
  const country = entry.country || "MX";
  const parts = [
    entry.email,
    entry.businessName.toLocaleLowerCase("es"),
    entry.city.toLocaleLowerCase("es"),
  ];
  // Keep the original fingerprint for legacy submissions so old browser tabs still deduplicate.
  if (country !== "MX") parts.push(country);
  const fingerprint = createHash("sha256")
    .update(parts.join("\0"))
    .digest("hex");
  const result = db
    .prepare(
      `INSERT INTO waitlist_entries (
    fingerprint, business_name, business_type, contact_name, email, whatsapp, city,
    neighborhood, landing_path, utm_source, utm_medium, utm_campaign, utm_content, utm_term, country, consent_version
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(fingerprint) DO NOTHING`,
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
      country,
      country === "MX" ? "waitlist-v1" : "waitlist-v2",
    );
  return { created: Number(result.changes) === 1 };
}

export async function backupDatabase(db, destination) {
  mkdirSync(path.dirname(destination), { recursive: true, mode: 0o700 });
  await backup(db, destination);
  chmodSync(destination, 0o600);
}
