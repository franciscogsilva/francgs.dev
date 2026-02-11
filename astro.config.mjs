import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeRaw from "rehype-raw";
import remarkDirective from "remark-directive";
import { remarkCallouts } from "./src/plugins/remark-callouts.mjs";
import { remarkStripRelatedLinks } from "./src/plugins/remark-strip-related-links.mjs";

import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server", // Server mode for SSR support
  adapter: node({
    mode: "standalone",
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  site: "https://francgs.dev",
  markdown: {
    remarkPlugins: [remarkDirective, remarkCallouts, remarkStripRelatedLinks],
    rehypePlugins: [rehypeRaw],
  },
  integrations: [
    sitemap({
      serialize(item) {
        const url = item.url;

        // Homepage — highest priority
        if (url === "https://francgs.dev/") {
          item.priority = 1.0;
          item.changefreq = "weekly";
        }
        // SILO category hub pages — high priority (pillar pages)
        else if (url.includes("/blog/category/")) {
          item.priority = 0.8;
          item.changefreq = "weekly";
        }
        // Blog index
        else if (url === "https://francgs.dev/blog/") {
          item.priority = 0.9;
          item.changefreq = "weekly";
        }
        // Individual blog posts
        else if (url.includes("/blog/")) {
          item.priority = 0.7;
          item.changefreq = "monthly";
        }
        // Snippets
        else if (url.includes("/snippets/")) {
          item.priority = 0.5;
          item.changefreq = "monthly";
        }
        // Tag pages — lower priority (taxonomy, not content)
        else if (url.includes("/tags/")) {
          item.priority = 0.3;
          item.changefreq = "monthly";
        }
        // Everything else (about, contact, links)
        else {
          item.priority = 0.5;
          item.changefreq = "monthly";
        }

        return item;
      },
    }),
  ],
});
