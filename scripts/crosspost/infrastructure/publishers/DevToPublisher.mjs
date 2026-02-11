const DEVTO_BASE_URL = "https://dev.to/api/articles";

const sanitizeTags = (tags) =>
  tags
    .map((tag) => tag.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
    .map((tag) => tag.replace(/-+/g, "-").replace(/^-|-$/g, ""))
    .filter(Boolean)
    .slice(0, 4);

export class DevToPublisher {
  constructor({ apiKey, publish = true }) {
    this.name = "devto";
    this.apiKey = apiKey;
    this.publishEnabled = publish;
    this.cacheLoaded = false;
    this.byCanonical = new Map();
  }

  isConfigured() {
    return Boolean(this.apiKey);
  }

  async findByCanonicalUrl(canonicalUrl) {
    if (!this.isConfigured()) return null;
    await this.loadExisting();
    return this.byCanonical.get(canonicalUrl) ?? null;
  }

  async loadExisting() {
    if (this.cacheLoaded) return;

    let page = 1;
    const perPage = 1000;

    while (true) {
      const response = await fetch(
        `${DEVTO_BASE_URL}/me/all?page=${page}&per_page=${perPage}`,
        {
          headers: {
            "api-key": this.apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Dev.to list failed: ${response.status}`);
      }

      const rows = await response.json();
      if (!Array.isArray(rows) || rows.length === 0) {
        break;
      }

      for (const row of rows) {
        if (row.canonical_url) {
          this.byCanonical.set(row.canonical_url, {
            id: String(row.id),
            url: row.url,
          });
        }
      }

      if (rows.length < perPage) {
        break;
      }

      page += 1;
    }

    this.cacheLoaded = true;
  }

  async publish(post, { dryRun = false } = {}) {
    if (dryRun) {
      return {
        id: `dry-run-${post.slug}`,
        url: `https://dev.to/dry-run/${post.slug}`,
      };
    }

    const payload = {
      article: {
        title: post.title,
        description: post.description,
        body_markdown: post.toMarkdown(),
        canonical_url: post.canonicalUrl,
        tags: sanitizeTags(post.tags),
        published: this.publishEnabled,
      },
    };

    const response = await fetch(DEVTO_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Dev.to publish failed: ${response.status} ${errorBody}`);
    }

    const created = await response.json();
    return {
      id: String(created.id),
      url: created.url,
    };
  }
}
