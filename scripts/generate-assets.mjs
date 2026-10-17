import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import * as fontkit from "fontkit";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const kit = path.join(root, "hooksage-brand-kit");
const tokens = await fs.readFile(path.join(kit, "tokens.css"), "utf8");
const color = (name) => tokens.match(new RegExp(`--${name}:([^;]+);`))[1];
const display = fontkit.openSync(
  path.join(kit, "fonts/bricolage-grotesque-latin-800-normal.woff2"),
);
const body = fontkit.openSync(
  path.join(kit, "fonts/dm-sans-latin-400-normal.woff2"),
);
function text(font, content, x, y, size, fill) {
  const run = font.layout(content);
  const scale = size / font.unitsPerEm;
  let offset = 0;
  return run.glyphs
    .map((glyph, i) => {
      const position = run.positions[i];
      const element = `<path fill="${fill}" d="${glyph.path.toSVG()}" transform="translate(${x + (offset + position.xOffset) * scale},${y - position.yOffset * scale}) scale(${scale},${-scale})"/>`;
      offset += position.xAdvance;
      return element;
    })
    .join("");
}
const logo = (
  await fs.readFile(path.join(kit, "logos/hooksage-lockup.svg"))
).toString("base64");
const mark = (
  await fs.readFile(path.join(kit, "logos/hooksage-mark.svg"))
).toString("base64");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${color("surface")}"/><path d="M900 -100v830" stroke="${color("border")}"/><image href="data:image/svg+xml;base64,${logo}" x="64" y="52" width="200" height="56"/><rect x="64" y="150" width="206" height="36" rx="18" fill="${color("accent-tint")}"/>${text(body, "Lista de espera", 85, 174, 18, color("accent-text"))}${text(display, "Videos para", 64, 296, 82, color("ink"))}${text(display, "tu restaurante.", 64, 388, 82, color("primary"))}${text(body, "Tus clips, listos para TikTok y Reels.", 68, 458, 27, color("ink-muted"))}<image href="data:image/svg+xml;base64,${mark}" x="954" y="215" width="174" height="174"/>${text(body, "hooksage.com", 68, 570, 23, color("primary"))}${text(body, "Hecho para restaurantes de la CDMX", 708, 570, 21, color("ink-muted"))}</svg>`;
await fs.mkdir(path.join(root, "public"), { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(path.join(root, "public/og.png"));
await sharp(path.join(kit, "logos/hooksage-app-icon.svg"))
  .resize(180, 180)
  .png()
  .toFile(path.join(root, "public/apple-touch-icon.png"));
console.log(
  "Generated public/og.png (1200×630) and public/apple-touch-icon.png (180×180) from original kit assets and glyphs.",
);
