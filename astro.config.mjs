import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeRaw from "rehype-raw";
import remarkDirective from "remark-directive";
import { remarkCallouts } from "./src/plugins/remark-callouts.mjs";

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
    remarkPlugins: [remarkDirective, remarkCallouts],
    rehypePlugins: [rehypeRaw],
  },
  integrations: [sitemap()],
});
