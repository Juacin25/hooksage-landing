import fs from "node:fs/promises";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { backupDatabase } from "../server/database.mjs";

const filename = path.resolve(
  process.env.DATABASE_PATH || "data/waitlist.sqlite",
);
const action = process.argv[2];
if (!["count", "backup", "export"].includes(action))
  throw new Error(
    "Usage: node scripts/database.mjs count|backup|export [destination]",
  );
const db = new DatabaseSync(filename, { readOnly: true });
try {
  if (action === "count")
    console.log(
      JSON.stringify(
        db.prepare("SELECT count(*) AS entries FROM waitlist_entries").get(),
      ),
    );
  else {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const destination = path.resolve(
      process.argv[3] ||
        `backups/waitlist-${stamp}.${action === "backup" ? "sqlite" : "csv"}`,
    );
    if (action === "backup") await backupDatabase(db, destination);
    else {
      const rows = db
        .prepare(
          "SELECT language, country, created_at, business_name, business_type, contact_name, email, whatsapp, city, neighborhood, landing_path, utm_source, utm_medium, utm_campaign, utm_content, utm_term, consent_version FROM waitlist_entries ORDER BY id",
        )
        .all();
      const headers = db
        .prepare("PRAGMA table_info(waitlist_entries)")
        .all()
        .map((item) => item.name)
        .filter((name) => !["id", "fingerprint"].includes(name));
      const csv = (value) => {
        let s = String(value ?? "");
        if (/^[=+@\-\t\r]/.test(s)) s = "'" + s;
        return `"${s.replaceAll('"', '""')}"`;
      };
      await fs.mkdir(path.dirname(destination), {
        recursive: true,
        mode: 0o700,
      });
      await fs.writeFile(
        destination,
        [
          headers.map(csv).join(","),
          ...rows.map((row) => headers.map((key) => csv(row[key])).join(",")),
        ].join("\r\n") + "\r\n",
        { mode: 0o600, flag: "wx" },
      );
    }
    console.log(`Saved ${destination}`);
  }
} finally {
  db.close();
}
