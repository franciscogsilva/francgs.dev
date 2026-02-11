import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_STATE = { posts: {} };

export class FilePublicationStateRepository {
  constructor({ filePath = ".crosspost/state.json" } = {}) {
    this.filePath = filePath;
    this.state = DEFAULT_STATE;
    this.loaded = false;
  }

  async load() {
    if (this.loaded) return;

    try {
      const raw = await readFile(this.filePath, "utf8");
      this.state = JSON.parse(raw);
    } catch {
      this.state = DEFAULT_STATE;
    }

    this.loaded = true;
  }

  async getPostPlatformState(slug, platform) {
    await this.load();
    return this.state.posts?.[slug]?.platforms?.[platform];
  }

  async setPostPlatformState(slug, platform, value) {
    await this.load();

    if (!this.state.posts[slug]) {
      this.state.posts[slug] = { platforms: {} };
    }

    this.state.posts[slug].platforms[platform] = value;
  }

  async save() {
    await this.load();
    const directory = path.dirname(this.filePath);
    await mkdir(directory, { recursive: true });
    await writeFile(this.filePath, JSON.stringify(this.state, null, 2), "utf8");
  }
}
