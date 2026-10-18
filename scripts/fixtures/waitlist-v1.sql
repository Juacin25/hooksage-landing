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
