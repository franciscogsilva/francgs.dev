const DEVTO_BASE_URL = "https://dev.to/api/articles";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseRetrySeconds = (response, bodyText) => {
  const retryAfter = response.headers.get("retry-after");
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds > 0) {
      return seconds;
    }
  }

  const match = bodyText.match(/try again in\s+(\d+)\s+seconds/i);
  if (match) {
    return Number(match[1]);
  }

  return 30;
};

const sanitizeTags = (tags) =>
  tags
    .map((tag) => tag.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
    .map((tag) => tag.replace(/-+/g, "-").replace(/^-|-$/g, ""))
    .filter(Boolean)
    .slice(0, 4);

export class DevToPublisher {
  constructor({
    apiKey,
    publish = true,
    maxRetries = 4,
    minIntervalMs = 3500,
  }) {
    this.name = "devto";
    this.apiKey = apiKey;
    this.publishEnabled = publish;
    this.maxRetries = maxRetries;
    this.minIntervalMs = minIntervalMs;
    this.cacheLoaded = false;
    this.byCanonical = new Map();
    this.lastPublishAt = 0;
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

    const elapsedSinceLast = Date.now() - this.lastPublishAt;
    if (this.lastPublishAt > 0 && elapsedSinceLast < this.minIntervalMs) {
      await sleep(this.minIntervalMs - elapsedSinceLast);
    }

    let attempt = 0;
    let created;

    while (attempt <= this.maxRetries) {
      const response = await fetch(DEVTO_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": this.apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        created = await response.json();
        break;
      }

      const errorBody = await response.text();

      if (response.status !== 429 || attempt === this.maxRetries) {
        throw new Error(`Dev.to publish failed: ${response.status} ${errorBody}`);
      }

      const retrySeconds = parseRetrySeconds(response, errorBody);
      await sleep(retrySeconds * 1000);
      attempt += 1;
    }

    this.lastPublishAt = Date.now();

    return {
      id: String(created.id),
      url: created.url,
    };
  }
}
