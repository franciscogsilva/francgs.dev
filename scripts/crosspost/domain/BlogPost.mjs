export class BlogPost {
  constructor({ slug, title, description, tags, pubDate, canonicalUrl, body, lang }) {
    this.slug = slug;
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.pubDate = pubDate;
    this.canonicalUrl = canonicalUrl;
    this.body = body;
    this.lang = lang;
  }

  toMarkdown() {
    const content = stripRelatedLinksSection(this.body.trim());
    const body = content.startsWith("#") ? content : `# ${this.title}\n\n${content}`;

    const footerLabel =
      this.lang === "es"
        ? "Version completa en mi blog"
        : "Read the full version on my blog";

    return `${body}\n\n---\n\n${footerLabel}: ${this.canonicalUrl}`;
  }
}

const stripRelatedLinksSection = (markdown) => {
  const lines = markdown.split(/\r?\n/);
  const output = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    const marker = /^#{0,6}\s*(related|relacionados)\s*:\s*$/i.test(line);

    if (!marker) {
      output.push(lines[i]);
      continue;
    }

    let j = i + 1;
    while (j < lines.length && lines[j].trim() === "") {
      j += 1;
    }

    let consumedUrlLines = 0;
    while (j < lines.length) {
      const candidate = lines[j].trim();
      const normalized = candidate.replace(/^[-*]\s+/, "");
      const isPlainUrl = /^(https?:\/\/\S+|\/\S+)$/i.test(normalized);
      const isMarkdownLink = /^\[[^\]]+\]\((https?:\/\/\S+|\/\S+)\)$/i.test(normalized);

      if (!isPlainUrl && !isMarkdownLink) {
        break;
      }

      consumedUrlLines += 1;
      j += 1;
    }

    if (consumedUrlLines > 0) {
      i = j - 1;
      while (output.length > 0 && output[output.length - 1].trim() === "") {
        output.pop();
      }
      continue;
    }

    output.push(lines[i]);
  }

  return output.join("\n").trim();
};
