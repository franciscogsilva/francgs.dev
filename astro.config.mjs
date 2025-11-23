import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeRaw from "rehype-raw";
import remarkDirective from "remark-directive";
import { remarkCallouts } from "./src/plugins/remark-callouts.mjs";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: "https://francgs.dev",
  markdown: {
    remarkPlugins: [remarkDirective, remarkCallouts],
    rehypePlugins: [rehypeRaw],
  },
});
