import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const BLOG_DIR = "src/data/blog";
const OUTPUT = "docs/seo/en-editorial-depth-report.md";

const files = (await readdir(BLOG_DIR)).filter((file) => file.endsWith(".md"));

const rows = [];

for (const file of files) {
  const fullPath = path.join(BLOG_DIR, file);
  const raw = await readFile(fullPath, "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) continue;

  const frontmatter = match[1];
  const body = match[2];

  if (/^\s*draft:\s*true\s*$/m.test(frontmatter)) continue;

  const langMatch = frontmatter.match(/^\s*lang:\s*(\w+)\s*$/m);
  const lang = langMatch?.[1] ?? "en";
  if (lang !== "en") continue;

  const titleMatch = frontmatter.match(/^\s*title:\s*"?(.+?)"?\s*$/m);
  const title = titleMatch?.[1] ?? file;
  const slug = file.replace(/\.md$/i, "").toLowerCase().replaceAll(".", "");

  const words = (body.match(/\b[\w'-]+\b/g) ?? []).length;
  const h2 = (body.match(/^##\s+/gm) ?? []).length;
  const h3 = (body.match(/^###\s+/gm) ?? []).length;
  const codeBlocks = Math.floor((body.match(/```/g) ?? []).length / 2);
  const hasChecklist = /- \[ \]/.test(body);

  let score = 0;
  if (words >= 600) score += 30;
  else if (words >= 500) score += 24;
  else if (words >= 420) score += 18;
  else score += 8;

  if (h2 >= 5) score += 20;
  else if (h2 >= 4) score += 16;
  else if (h2 >= 3) score += 12;
  else score += 6;

  if (codeBlocks >= 2) score += 20;
  else if (codeBlocks >= 1) score += 12;
  else score += 6;

  if (h3 >= 3) score += 10;
  else if (h3 >= 1) score += 6;
  else score += 2;

  if (hasChecklist) score += 10;
  else score += 4;

  score = Math.min(score, 100);

  const tier = score >= 85 ? "A" : score >= 75 ? "B" : score >= 65 ? "C" : "D";

  rows.push({ title, slug, words, h2, h3, codeBlocks, hasChecklist, score, tier });
}

rows.sort((a, b) => a.score - b.score || a.words - b.words);

const lines = [
  "# English Editorial Depth Report",
  "",
  "Automated structural quality scan for `lang: en` posts.",
  "",
  "## Scoring Model",
  "",
  "- Depth (word count)",
  "- Sectioning (H2/H3)",
  "- Practicality (code blocks)",
  "- Actionability (checklist)",
  "",
  "## Results",
  "",
  "| Tier | Score | Words | H2 | H3 | Code | Checklist | Slug |",
  "|---|---:|---:|---:|---:|---:|---|---|",
  ...rows.map(
    (row) =>
      `| ${row.tier} | ${row.score} | ${row.words} | ${row.h2} | ${row.h3} | ${row.codeBlocks} | ${row.hasChecklist ? "yes" : "no"} | \`${row.slug}\` |`
  ),
  "",
  `Total EN posts scanned: ${rows.length}`,
];

await writeFile(OUTPUT, `${lines.join("\n")}\n`, "utf8");
console.log(`Generated ${OUTPUT}`);
