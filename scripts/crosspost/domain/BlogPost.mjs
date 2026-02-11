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
    const content = this.body.trim();
    if (content.startsWith("#")) {
      return content;
    }
    return `# ${this.title}\n\n${content}`;
  }
}
