export class BlogPost {
  constructor({ slug, title, description, tags, pubDate, canonicalUrl, body }) {
    this.slug = slug;
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.pubDate = pubDate;
    this.canonicalUrl = canonicalUrl;
    this.body = body;
  }

  toMarkdown() {
    const content = this.body.trim();
    if (content.startsWith("#")) {
      return content;
    }
    return `# ${this.title}\n\n${content}`;
  }
}
