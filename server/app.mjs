import http from "node:http";
import { createReadStream, statSync, realpathSync } from "node:fs";
import path from "node:path";
import { isIP } from "node:net";
import { validateEntry } from "./validation.mjs";
import { saveEntry } from "./database.mjs";
import { sendFormResponse } from "./form-response.mjs";

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
  ".mp4": "video/mp4",
  ".vtt": "text/vtt; charset=utf-8",
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
  notify = null,
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
  function readBody(request, encodedForm) {
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
          const body = Buffer.concat(chunks).toString("utf8");
          if (!encodedForm) return resolve(JSON.parse(body));
          const params = new URLSearchParams(body);
          const keys = [...params.keys()];
          if (new Set(keys).size !== keys.length)
            throw new Error("duplicate_fields");
          const input = Object.fromEntries(params);
          input.attribution = { landing_path: input.landing_path || "/" };
          resolve(input);
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
    // Retire the previous niche while preserving campaign attribution from old links.
    if (
      ["GET", "HEAD"].includes(request.method) &&
      /^\/videos-para-(taquerias|hamburgueserias|heladerias|sushi)\/?$/.test(
        pathname,
      )
    ) {
      response.writeHead(301, {
        Location: "/" + new URL(request.url, "http://localhost").search,
      });
      return response.end();
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
      const contentType = request.headers["content-type"]?.split(";")[0].trim();
      const encodedForm = contentType === "application/x-www-form-urlencoded";
      const htmlForm =
        encodedForm &&
        String(request.headers.accept || "").includes("text/html");
      let responseLanguage = String(request.headers["accept-language"] || "")
        .toLowerCase()
        .startsWith("en")
        ? "en"
        : "es";
      try {
        const referrer = new URL(request.headers.referer);
        if (allowedOrigins.has(referrer.origin))
          responseLanguage = referrer.pathname.startsWith("/en/") ? "en" : "es";
      } catch {}
      const reply = (status, body, headers = {}) =>
        htmlForm
          ? sendFormResponse(response, status, body, headers, responseLanguage)
          : json(response, status, body, headers);
      if (pathname !== "/api/waitlist") return reply(404, { ok: false });
      const origin = request.headers.origin;
      if (!allowedOrigins.has(origin))
        return reply(403, { ok: false, error: "origin_not_allowed" });
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
        return reply(405, { ok: false }, { Allow: "POST, OPTIONS" });
      if (limited(request))
        return reply(
          429,
          { ok: false, error: "rate_limited" },
          { "Retry-After": String(Math.ceil(rateWindowMs / 1000)) },
        );
      if (contentType !== "application/json" && !encodedForm)
        return reply(415, { ok: false });
      if (Number(request.headers["content-length"]) > BODY_LIMIT)
        return reply(413, { ok: false });
      let entry;
      try {
        const input = await readBody(request, encodedForm);
        if (input?.language === "en" || input?.language === "es")
          responseLanguage = input.language;
        entry = validateEntry(input);
      } catch (error) {
        return reply(error.status || 400, { ok: false });
      }
      if (!entry) return reply(400, { ok: false, error: "invalid_fields" });
      try {
        const { created, detailsAdded, notificationDetails } = saveEntry(
          db,
          entry,
        );
        reply(created ? 201 : 200, { ok: true, created });
        // The database is the source of truth; a failed email never fails the submission.
        if ((created || detailsAdded) && notify)
          notify({
            ...entry,
            ...notificationDetails,
            requestUpdate: detailsAdded,
          }).catch(() => logger.error("waitlist_notify_failed"));
        return;
      } catch {
        // Never log request bodies or database error strings containing user data.
        logger.error("waitlist_save_failed");
        return reply(503, {
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
      const size = statSync(filename).size;
      const headers = {
        "Content-Type": type,
        "Content-Length": size,
        "Cache-Control": type.startsWith("text/html")
          ? "no-cache"
          : "public, max-age=3600",
      };
      let status = 200;
      let streamOptions;
      if (type === "video/mp4") {
        headers["Accept-Ranges"] = "bytes";
        const range = request.headers.range;
        // A single byte range lets browsers seek without downloading the whole video.
        // Without a matching validator, If-Range falls back to the complete representation.
        if (request.method === "GET" && range && !request.headers["if-range"]) {
          const match = /^bytes=(\d*)-(\d*)$/.exec(range);
          let start = 0;
          let end = size - 1;
          let valid = Boolean(match && (match[1] || match[2]) && size > 0);
          if (valid && !match[1]) {
            const suffix = Number(match[2]);
            valid = Number.isSafeInteger(suffix) && suffix > 0;
            start = Math.max(0, size - suffix);
          } else if (valid) {
            start = Number(match[1]);
            end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
            valid =
              Number.isSafeInteger(start) &&
              Number.isSafeInteger(end) &&
              start >= 0 &&
              start <= end &&
              start < size;
          }
          if (!valid) {
            response.writeHead(416, {
              "Content-Range": "bytes */" + size,
              "Accept-Ranges": "bytes",
              "Content-Length": 0,
            });
            return response.end();
          }
          status = 206;
          headers["Content-Range"] = "bytes " + start + "-" + end + "/" + size;
          headers["Content-Length"] = end - start + 1;
          streamOptions = { start, end };
        }
      }
      response.writeHead(status, headers);
      if (request.method === "HEAD") return response.end();
      const stream = createReadStream(filename, streamOptions);
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
