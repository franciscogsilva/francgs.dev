const MEDIUM_API_BASE = "https://api.medium.com/v1";

const sanitizeTags = (tags) =>
  tags
    .map((tag) => tag.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
    .map((tag) => tag.replace(/-+/g, "-").replace(/^-|-$/g, ""))
    .filter(Boolean)
    .slice(0, 3);

export class MediumPublisher {
  constructor({ token, publishStatus = "public" }) {
    this.name = "medium";
    this.token = token;
    this.publishStatus = publishStatus;
    this.authorId = null;
  }

  isConfigured() {
    return Boolean(this.token);
  }

  async findByCanonicalUrl() {
    return null;
  }

  async resolveAuthorId() {
    if (this.authorId) return this.authorId;

    const response = await fetch(`${MEDIUM_API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Medium /me failed: ${response.status} ${errorBody}`);
    }

    const body = await response.json();
    this.authorId = body?.data?.id;

    if (!this.authorId) {
      throw new Error("Medium author ID not found in /me response");
    }

    return this.authorId;
  }

  async publish(post, { dryRun = false } = {}) {
    if (dryRun) {
      return {
        id: `dry-run-${post.slug}`,
        url: `https://medium.com/dry-run/${post.slug}`,
      };
    }

    const authorId = await this.resolveAuthorId();

    const payload = {
      title: post.title,
      contentFormat: "markdown",
      content: post.toMarkdown(),
      canonicalUrl: post.canonicalUrl,
      tags: sanitizeTags(post.tags),
      publishStatus: this.publishStatus,
    };

    const response = await fetch(`${MEDIUM_API_BASE}/users/${authorId}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Medium publish failed: ${response.status} ${errorBody}`);
    }

    const created = await response.json();
    return {
      id: created?.data?.id,
      url: created?.data?.url,
    };
  }
}
