import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { copyFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";

// lastmod only where it is accurate: a blog post's own updatedDate.
function postLastmod(url) {
  const slug = url.match(/\/blog\/([^/]+)\/$/)?.[1];
  const file = `src/content/blog/${slug}.md`;
  if (!slug || !existsSync(file)) return;
  const date = readFileSync(file, "utf8").match(/^updatedDate:\s*(\S+)/m)?.[1];
  return date && new Date(date).toISOString();
}

export default defineConfig({
  site: "https://hooksage.com",
  output: "static",
  // CSS in the HTML: no render-blocking request before the hero title paints.
  build: { inlineStylesheets: "always" },
  vite: {
    build: { target: ["chrome80", "edge80", "firefox78", "safari14"] },
    server: { proxy: { "/api": "http://127.0.0.1:8787" } },
  },
  integrations: [
    sitemap({
      serialize(item) {
        const lastmod = postLastmod(item.url);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
    {
      name: "hooksage-sitemap-alias",
      hooks: {
        "astro:build:done": async ({ dir }) => {
          await copyFile(
            new URL("sitemap-index.xml", dir),
            new URL("sitemap.xml", dir),
          );
        },
      },
    },
  ],
  devToolbar: { enabled: false },
});
