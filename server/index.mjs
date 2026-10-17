import path from "node:path";
import { fileURLToPath } from "node:url";
import { openDatabase } from "./database.mjs";
import { createApp } from "./app.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 8787);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("Invalid PORT");
const staticDir = path.resolve(
  process.env.STATIC_DIR || path.join(root, "dist"),
);
const databasePath = path.resolve(
  process.env.DATABASE_PATH || path.join(root, "data/waitlist.sqlite"),
);
if (databasePath.startsWith(staticDir + path.sep))
  throw new Error("Database must be outside the public directory");
const origins = (
  process.env.ALLOWED_ORIGINS ||
  "http://127.0.0.1:4321,http://localhost:4321,http://127.0.0.1:8787,http://localhost:8787"
)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
if (process.env.NODE_ENV === "production" && !process.env.ALLOWED_ORIGINS)
  throw new Error("ALLOWED_ORIGINS is required in production");
for (const origin of origins)
  if (new URL(origin).origin !== origin)
    throw new Error("Use exact origins without paths");
const db = openDatabase(databasePath);
const server = createApp({
  db,
  staticDir,
  origins,
  trustProxy: process.env.TRUST_PROXY === "true",
});
server.listen(port, process.env.HOST || "127.0.0.1", () =>
  console.log(`Hooksage listening on port ${port}`),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () =>
    server.close(() => {
      db.close();
      process.exit(0);
    }),
  );
