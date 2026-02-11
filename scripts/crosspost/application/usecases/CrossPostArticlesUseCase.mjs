export class CrossPostArticlesUseCase {
  constructor({ postRepository, stateRepository, publishers, logger = console }) {
    this.postRepository = postRepository;
    this.stateRepository = stateRepository;
    this.publishers = publishers;
    this.logger = logger;
  }

  async execute({
    all = false,
    dryRun = false,
    changedFiles = [],
    langFilter = [],
    maxPosts,
    prioritySlugs = [],
  }) {
    const allMatchedPosts = await this.postRepository.listPublishedPosts({
      all,
      changedFiles,
      langFilter,
    });
    const priorityIndex = new Map(prioritySlugs.map((slug, index) => [slug, index]));

    const prioritizedPosts = [...allMatchedPosts].sort((a, b) => {
      const aPriority = priorityIndex.has(a.slug)
        ? priorityIndex.get(a.slug)
        : Number.MAX_SAFE_INTEGER;
      const bPriority = priorityIndex.has(b.slug)
        ? priorityIndex.get(b.slug)
        : Number.MAX_SAFE_INTEGER;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      return 0;
    });

    const posts = Number.isFinite(maxPosts) && maxPosts > 0
      ? prioritizedPosts.slice(0, maxPosts)
      : prioritizedPosts;
    const summary = {
      totalPosts: posts.length,
      matchedPosts: allMatchedPosts.length,
      published: 0,
      skipped: 0,
      failed: 0,
    };

    if (posts.length === 0) {
      this.logger.log("No posts matched for cross-posting.");
      return summary;
    }

    for (const post of posts) {
      this.logger.log(`\nPost: ${post.slug}`);

      for (const publisher of this.publishers) {
        if (!publisher.isConfigured()) {
          this.logger.log(`  - ${publisher.name}: skipped (missing credentials)`);
          summary.skipped += 1;
          continue;
        }

        const state = await this.stateRepository.getPostPlatformState(
          post.slug,
          publisher.name
        );

        if (state?.url) {
          this.logger.log(`  - ${publisher.name}: skipped (already tracked)`);
          summary.skipped += 1;
          continue;
        }

        try {
          const existing = await publisher.findByCanonicalUrl(post.canonicalUrl);
          if (existing) {
            await this.stateRepository.setPostPlatformState(post.slug, publisher.name, {
              id: existing.id,
              url: existing.url,
              canonicalUrl: post.canonicalUrl,
              syncedAt: new Date().toISOString(),
            });
            this.logger.log(`  - ${publisher.name}: skipped (already exists)`);
            summary.skipped += 1;
            continue;
          }

          const published = await publisher.publish(post, { dryRun });
          await this.stateRepository.setPostPlatformState(post.slug, publisher.name, {
            id: published.id,
            url: published.url,
            canonicalUrl: post.canonicalUrl,
            syncedAt: new Date().toISOString(),
          });

          this.logger.log(`  - ${publisher.name}: published ${published.url}`);
          summary.published += 1;
        } catch (error) {
          this.logger.error(`  - ${publisher.name}: failed`, error.message);
          summary.failed += 1;
        }
      }
    }

    await this.stateRepository.save();
    return summary;
  }
}
