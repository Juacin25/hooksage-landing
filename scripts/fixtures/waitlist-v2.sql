CREATE TABLE waitlist_entries (
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
);
CREATE INDEX waitlist_created_at ON waitlist_entries(created_at);
PRAGMA user_version = 2;
