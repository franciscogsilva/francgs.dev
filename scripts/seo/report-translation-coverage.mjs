import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const BLOG_DIR = "src/data/blog";
const OUTPUT = "docs/seo/translation-coverage.md";

const getField = (source, field) => {
  const match = source.match(new RegExp(`^\\s*${field}:\\s*(.+)$`, "m"));
  if (!match) return undefined;
  return match[1].trim().replace(/^['"]|['"]$/g, "");
};

const getTranslationKey = (slug, frontmatter) => {
  const explicit = getField(frontmatter, "translationKey");
  if (explicit) return explicit;
  const numberPrefix = slug.match(/^(\d+)/)?.[1];
  return numberPrefix ? `post-${numberPrefix}` : slug;
};

const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith(".md"));
const groups = new Map();

for (const file of files) {
  const fullPath = path.join(BLOG_DIR, file);
  const raw = await readFile(fullPath, "utf8");
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) continue;

  const frontmatter = fmMatch[1];
  const draft = getField(frontmatter, "draft") === "true";
  if (draft) continue;

  const slug = file.replace(/\.md$/i, "").toLowerCase().replaceAll(".", "");
  const lang = getField(frontmatter, "lang") || "en";
  const title = getField(frontmatter, "title") || slug;
  const key = getTranslationKey(slug, frontmatter);

  if (!groups.has(key)) {
    groups.set(key, []);
  }

  groups.get(key).push({ slug, lang, title });
}

const lines = [
  "# Translation Coverage Report",
  "",
  "## Legend",
  "",
  "- OK: translation key has both `es` and `en`",
  "- Missing: translation key has only one language",
  "",
  "## Coverage",
  "",
  "| Translation Key | Status | Languages | Slugs |",
  "|---|---|---|---|",
];

for (const [key, entries] of [...groups.entries()].sort((a, b) =>
  a[0].localeCompare(b[0])
)) {
  const langs = [...new Set(entries.map((entry) => entry.lang))].sort();
  const status = langs.includes("es") && langs.includes("en") ? "OK" : "Missing";
  const slugs = entries.map((entry) => `\`${entry.slug}\``).join("<br>");
  lines.push(`| ${key} | ${status} | ${langs.join(", ")} | ${slugs} |`);
}

await writeFile(OUTPUT, `${lines.join("\n")}\n`, "utf8");
console.log(`Generated ${OUTPUT}`);
