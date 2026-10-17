import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { copyFile } from "node:fs/promises";
export default defineConfig({
  site: "https://hooksage.com",
  output: "static",
  vite: {
    build: { target: ["chrome80", "edge80", "firefox78", "safari14"] },
    server: { proxy: { "/api": "http://127.0.0.1:8787" } },
  },
  integrations: [
    sitemap(),
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
