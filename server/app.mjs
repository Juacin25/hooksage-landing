import http from "node:http";
import { createReadStream, statSync, realpathSync } from "node:fs";
import path from "node:path";
import { isIP } from "node:net";
import { validateEntry } from "./validation.mjs";
import { saveEntry } from "./database.mjs";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};
const BODY_LIMIT = 8192;

export function createApp({
  db,
  staticDir,
  origins,
  trustProxy = false,
  rateLimit = 10,
  rateWindowMs = 15 * 60 * 1000,
  logger = console,
}) {
  const root = realpathSync(staticDir);
  const allowedOrigins = new Set(origins);
  const attempts = new Map();
  function limited(request) {
    const forwarded = String(request.headers["x-forwarded-for"] || "")
      .split(",")
      .at(-1)
      .trim();
    const key =
      trustProxy && isIP(forwarded)
        ? forwarded
        : request.socket.remoteAddress || "unknown";
    const now = Date.now();
    for (const [ip, bucket] of attempts)
      if (now >= bucket.until) attempts.delete(ip);
    if (!attempts.has(key)) {
      if (attempts.size >= 10000) return true;
      attempts.set(key, { count: 0, until: now + rateWindowMs });
    }
    return ++attempts.get(key).count > rateLimit;
  }
  function json(response, status, body, headers = {}) {
    response.writeHead(status, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers,
    });
    response.end(JSON.stringify(body));
  }
  function readJson(request) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      let length = 0;
      let failed = false;
      request.on("data", (chunk) => {
        if (failed) return;
        length += chunk.length;
        if (length > BODY_LIMIT) {
          failed = true;
          reject(Object.assign(new Error("body_too_large"), { status: 413 }));
        } else chunks.push(chunk);
      });
      request.on("end", () => {
        if (failed) return;
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
        } catch {
          reject(Object.assign(new Error("invalid_json"), { status: 400 }));
        }
      });
      request.on("error", reject);
      request.on("aborted", () => reject(new Error("request_aborted")));
    });
  }
  const server = http.createServer(async (request, response) => {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
    } catch {
      return json(response, 400, { ok: false });
    }
    if (pathname === "/healthz" && request.method === "GET") {
      try {
        db.prepare("SELECT 1 FROM waitlist_entries LIMIT 1").get();
        return json(response, 200, { ok: true });
      } catch {
        return json(response, 503, { ok: false });
      }
    }
    if (pathname.startsWith("/api/")) {
      if (pathname !== "/api/waitlist")
        return json(response, 404, { ok: false });
      const origin = request.headers.origin;
      if (!allowedOrigins.has(origin))
        return json(response, 403, { ok: false, error: "origin_not_allowed" });
      response.setHeader("Access-Control-Allow-Origin", origin);
      response.setHeader("Vary", "Origin");
      if (request.method === "OPTIONS") {
        response.writeHead(204, {
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "600",
        });
        return response.end();
      }
      if (request.method !== "POST")
        return json(response, 405, { ok: false }, { Allow: "POST, OPTIONS" });
      if (limited(request))
        return json(
          response,
          429,
          { ok: false, error: "rate_limited" },
          { "Retry-After": String(Math.ceil(rateWindowMs / 1000)) },
        );
      if (
        request.headers["content-type"]?.split(";")[0].trim() !==
        "application/json"
      )
        return json(response, 415, { ok: false });
      if (Number(request.headers["content-length"]) > BODY_LIMIT)
        return json(response, 413, { ok: false });
      let entry;
      try {
        entry = validateEntry(await readJson(request));
      } catch (error) {
        return json(response, error.status || 400, { ok: false });
      }
      if (!entry)
        return json(response, 400, { ok: false, error: "invalid_fields" });
      try {
        const { created } = saveEntry(db, entry);
        return json(response, created ? 201 : 200, { ok: true, created });
      } catch {
        // Never log request bodies or database error strings containing user data.
        logger.error("waitlist_save_failed");
        return json(response, 503, {
          ok: false,
          error: "temporarily_unavailable",
        });
      }
    }
    if (!["GET", "HEAD"].includes(request.method))
      return json(response, 405, { ok: false });
    if (pathname.split("/").some((segment) => segment.startsWith(".")))
      return json(response, 404, { ok: false });
    try {
      let filename = path.resolve(root, `.${pathname}`);
      if (!filename.startsWith(root + path.sep) && filename !== root)
        throw new Error("outside_root");
      if (statSync(filename).isDirectory())
        filename = path.join(filename, "index.html");
      filename = realpathSync(filename);
      if (!filename.startsWith(root + path.sep))
        throw new Error("outside_root");
      const type = MIME[path.extname(filename)];
      if (!type) throw new Error("unsupported_file");
      response.writeHead(200, {
        "Content-Type": type,
        "Content-Length": statSync(filename).size,
        "Cache-Control": type.startsWith("text/html")
          ? "no-cache"
          : "public, max-age=3600",
      });
      if (request.method === "HEAD") return response.end();
      const stream = createReadStream(filename);
      stream.on("error", () => response.destroy());
      stream.pipe(response);
    } catch {
      json(response, 404, { ok: false });
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  return server;
}
