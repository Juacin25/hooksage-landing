import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import sharp from "sharp";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const output = path.join(root, "artifacts");
const theme = process.argv.includes("--light") ? "light" : "system";
const reportName =
  theme === "light" ? "lighthouse-mobile-light" : "lighthouse-mobile";
await fs.mkdir(output, { recursive: true });
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const name = decodeURIComponent(url.pathname);
    let target = path.resolve(dist, "." + name);
    if (!target.startsWith(dist + path.sep) && target !== dist)
      throw new Error("Invalid path");
    if ((await fs.stat(target)).isDirectory())
      target = path.join(target, "index.html");
    let body = await fs.readFile(target);
    // QA-only override to exercise the existing light tokens without changing production HTML.
    if (theme === "light" && path.extname(target) === ".html")
      body = Buffer.from(
        body
          .toString()
          .replace(
            '<html lang="es-UY">',
            '<html lang="es-UY" data-theme="light">',
          ),
      );
    res.writeHead(200, {
      "Content-Type": types[path.extname(target)] || "application/octet-stream",
      "Cache-Control": "public, max-age=3600",
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = `http://127.0.0.1:${server.address().port}/`;
const cli = path.join(root, "node_modules/lighthouse/cli/index.js");
try {
  const args = [
    cli,
    address,
    "--chrome-flags=--headless=new",
    "--only-categories=performance,accessibility,best-practices,seo",
    "--output=html",
    "--output=json",
    `--output-path=${path.join(output, reportName)}`,
    "--quiet",
  ];
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: root,
      stdio: "inherit",
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`Lighthouse exit ${code}`)),
    );
  });
  const report = JSON.parse(
    await fs.readFile(path.join(output, `${reportName}.report.json`), "utf8"),
  );
  const scores = Object.fromEntries(
    Object.entries(report.categories).map(([name, category]) => [
      name,
      Math.round(category.score * 100),
    ]),
  );
  console.log(JSON.stringify(scores, null, 2));
  const screenshot = report.audits["final-screenshot"]?.details?.data;
  if (screenshot)
    await fs.writeFile(
      path.join(output, `${reportName}.jpg`),
      Buffer.from(screenshot.split(",")[1], "base64"),
    );
  const fullScreenshot = report.fullPageScreenshot?.screenshot;
  if (fullScreenshot?.data) {
    const bytes = Buffer.from(fullScreenshot.data.split(",")[1], "base64");
    await fs.writeFile(path.join(output, `${reportName}-page.jpg`), bytes);
    await sharp(bytes)
      .extract({
        left: 0,
        top: 0,
        width: fullScreenshot.width,
        height: Math.min(920, fullScreenshot.height),
      })
      .jpeg({ quality: 90 })
      .toFile(path.join(output, `${reportName}-hero.jpg`));
  }
  const failed = Object.entries(report.audits)
    .filter(
      ([, audit]) =>
        audit.score !== null &&
        audit.score < 1 &&
        ["binary", "numeric"].includes(audit.scoreDisplayMode),
    )
    .map(([id, audit]) => ({
      id,
      title: audit.title,
      score: audit.score,
      details: audit.details?.items?.slice(0, 8),
    }));
  await fs.writeFile(
    path.join(output, `${reportName}-summary.json`),
    JSON.stringify({ scores, failed }, null, 2),
  );
  if (Object.values(scores).some((score) => score < 95)) process.exitCode = 1;
} finally {
  await new Promise((resolve) => server.close(resolve));
}
