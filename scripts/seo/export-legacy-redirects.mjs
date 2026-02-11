import { readFile, writeFile } from "node:fs/promises";

const MIDDLEWARE_PATH = "src/middleware.ts";
const OUTPUT_PATH = "docs/seo/gsc-legacy-redirects.csv";
const SITE_URL = "https://francgs.dev";

const source = await readFile(MIDDLEWARE_PATH, "utf8");

const mapBlockMatch = source.match(
  /const\s+LEGACY_BLOG_REDIRECTS:[\s\S]*?=\s*\{([\s\S]*?)\};/
);

if (!mapBlockMatch) {
  throw new Error("LEGACY_BLOG_REDIRECTS block not found in middleware");
}

const mapBlock = mapBlockMatch[1];
const pairRegex = /"([^"]+)"\s*:\s*"([^"]+)"/g;
const rows = [];

let match;
while ((match = pairRegex.exec(mapBlock)) !== null) {
  const legacyPath = match[1];
  const canonicalPath = match[2];
  rows.push({
    legacyPath,
    canonicalPath,
    legacyUrl: `${SITE_URL}${legacyPath}`,
    canonicalUrl: `${SITE_URL}${canonicalPath}`,
  });
}

rows.sort((a, b) => a.legacyPath.localeCompare(b.legacyPath));

const header = [
  "legacy_path",
  "canonical_path",
  "legacy_url",
  "canonical_url",
].join(",");

const csv = [
  header,
  ...rows.map((r) =>
    [r.legacyPath, r.canonicalPath, r.legacyUrl, r.canonicalUrl]
      .map((v) => `"${v}"`)
      .join(",")
  ),
].join("\n");

await writeFile(OUTPUT_PATH, `${csv}\n`, "utf8");
console.log(`Exported ${rows.length} redirects -> ${OUTPUT_PATH}`);
