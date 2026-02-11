import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { BlogPost } from "../../domain/BlogPost.mjs";

const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---\n?/;

const normalizeSlug = (filename) =>
  filename.replace(/\.md$/i, "").toLowerCase().replaceAll(".", "");

const parseInlineArray = (raw) => {
  const clean = raw.trim();
  if (!clean.startsWith("[") || !clean.endsWith("]")) {
    return [];
  }
  const inner = clean.slice(1, -1).trim();
  if (!inner) return [];
  return inner
    .split(",")
    .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
    .filter(Boolean);
};

const readField = (source, field) => {
  const match = source.match(new RegExp(`^\\s*${field}:\\s*(.+)$`, "m"));
  if (!match) return undefined;
  return match[1].trim().replace(/^['"]|['"]$/g, "");
};

export class AstroMarkdownPostRepository {
  constructor({ contentDir = "src/data/blog", siteUrl = "https://francgs.dev" } = {}) {
    this.contentDir = contentDir;
    this.siteUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  }

  async listPublishedPosts({ all = false, changedFiles = [] } = {}) {
    const files = await readdir(this.contentDir);
    const markdownFiles = files.filter((f) => f.endsWith(".md"));

    const allowedSet = new Set(
      changedFiles
        .map((f) => f.trim())
        .filter(Boolean)
        .map((f) => path.basename(f))
    );

    if (!all && allowedSet.size === 0) {
      return [];
    }

    const selectedFiles = all
      ? markdownFiles
      : markdownFiles.filter((f) => allowedSet.has(f));

    const posts = [];

    for (const filename of selectedFiles) {
      const absolutePath = path.join(this.contentDir, filename);
      const raw = await readFile(absolutePath, "utf8");
      const frontmatterMatch = raw.match(FRONTMATTER_PATTERN);

      if (!frontmatterMatch) continue;

      const frontmatter = frontmatterMatch[1];
      const body = raw.replace(FRONTMATTER_PATTERN, "").trim();
      const draft = readField(frontmatter, "draft") === "true";

      if (draft) continue;

      const title = readField(frontmatter, "title") ?? normalizeSlug(filename);
      const description = readField(frontmatter, "description") ?? "";
      const pubDate = readField(frontmatter, "pubDate") ?? "1970-01-01";
      const tags = parseInlineArray(readField(frontmatter, "tags") ?? "[]");
      const slug = normalizeSlug(filename);
      const canonicalUrl = `${this.siteUrl}/blog/${slug}/`;

      posts.push(
        new BlogPost({
          slug,
          title,
          description,
          tags,
          pubDate,
          canonicalUrl,
          body,
        })
      );
    }

    return posts.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));
  }
}
