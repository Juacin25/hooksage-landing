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
  country TEXT NOT NULL DEFAULT 'MX' CHECK(country IN ('UY','AR','MX','US','GB')),
  language TEXT NOT NULL DEFAULT 'es' CHECK(language IN ('es','en')),
  footage_url TEXT NOT NULL DEFAULT '' CHECK(length(footage_url) <= 2048),
  editing_feedback TEXT NOT NULL DEFAULT '' CHECK(length(editing_feedback) <= 1000)
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
    if (version > 4) throw new Error("Unsupported database schema version");
    const exists = db
      .prepare(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name='waitlist_entries'",
      )
      .get();
    if (exists && version < 4) {
      const common = [
        "id",
        "fingerprint",
        "business_name",
        "business_type",
        "contact_name",
        "email",
        "whatsapp",
        "city",
        "neighborhood",
        "landing_path",
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
        "consent_version",
        "created_at",
      ];
      const oldColumns = new Set(
        db
          .prepare("PRAGMA table_info(waitlist_entries)")
          .all()
          .map((column) => column.name),
      );
      if (common.some((column) => !oldColumns.has(column)))
        throw new Error("Unsupported legacy database schema");
      const snapshot = `${filename}.before-v4-${Date.now()}.sqlite`;
      db.exec(`VACUUM INTO '${snapshot.replaceAll("'", "''")}'`);
      chmodSync(snapshot, 0o600);
      db.exec("BEGIN IMMEDIATE");
      try {
        if (version < 3) {
          const columns = [...common, "country", "language"];
          const select = [
            ...common,
            oldColumns.has("country") ? "country" : "'MX'",
            oldColumns.has("language") ? "language" : "'es'",
          ];
          db.exec(
            "ALTER TABLE waitlist_entries RENAME TO waitlist_entries_legacy",
          );
          db.exec(schema);
          db.exec(`INSERT INTO waitlist_entries (${columns.join(",")}) SELECT ${select.join(",")} FROM waitlist_entries_legacy;
            DROP TABLE waitlist_entries_legacy;
            CREATE INDEX waitlist_created_at ON waitlist_entries(created_at);`);
        } else {
          db.exec(
            "ALTER TABLE waitlist_entries ADD COLUMN footage_url TEXT NOT NULL DEFAULT '' CHECK(length(footage_url) <= 2048)",
          );
          db.exec(
            "ALTER TABLE waitlist_entries ADD COLUMN editing_feedback TEXT NOT NULL DEFAULT '' CHECK(length(editing_feedback) <= 1000)",
          );
        }
        db.exec("PRAGMA user_version = 4; COMMIT;");
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
    } else if (!exists) {
      db.exec(
        `BEGIN IMMEDIATE; ${schema}; CREATE INDEX waitlist_created_at ON waitlist_entries(created_at); PRAGMA user_version = 4; COMMIT;`,
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
  if (country !== "MX") parts.push(country);
  const fingerprint = createHash("sha256")
    .update(parts.join("\0"))
    .digest("hex");
  const footageUrl = entry.footageUrl || "";
  const editingFeedback = entry.editingFeedback || "";
  const result = db
    .prepare(
      `INSERT INTO waitlist_entries (
    fingerprint, business_name, business_type, contact_name, email, whatsapp, city,
    neighborhood, landing_path, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
    country, consent_version, language, footage_url, editing_feedback
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      entry.language || "es",
      footageUrl,
      editingFeedback,
    );
  const created = Number(result.changes) === 1;
  let detailsAdded = false;
  // An existing subscriber can add a clip later. Retries never replace submitted details or create another lead.
  if (!created && (footageUrl || editingFeedback)) {
    const update = db
      .prepare(
        `UPDATE waitlist_entries SET
      footage_url = CASE WHEN footage_url = '' THEN ? ELSE footage_url END,
      editing_feedback = CASE WHEN editing_feedback = '' THEN ? ELSE editing_feedback END
      WHERE fingerprint = ? AND ((footage_url = '' AND ? <> '') OR (editing_feedback = '' AND ? <> ''))
    `,
      )
      .run(
        footageUrl,
        editingFeedback,
        fingerprint,
        footageUrl,
        editingFeedback,
      );
    detailsAdded = Number(update.changes) === 1;
  }
  const stored = detailsAdded
    ? db
        .prepare(
          "SELECT footage_url, editing_feedback FROM waitlist_entries WHERE fingerprint = ?",
        )
        .get(fingerprint)
    : null;
  return {
    created,
    detailsAdded,
    notificationDetails: stored
      ? {
          footageUrl: stored.footage_url,
          editingFeedback: stored.editing_feedback,
        }
      : null,
  };
}

export async function backupDatabase(db, destination) {
  mkdirSync(path.dirname(destination), { recursive: true, mode: 0o700 });
  await backup(db, destination);
  chmodSync(destination, 0o600);
}
