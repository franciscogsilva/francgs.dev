import { CrossPostArticlesUseCase } from "./application/usecases/CrossPostArticlesUseCase.mjs";
import { DevToPublisher } from "./infrastructure/publishers/DevToPublisher.mjs";
import { MediumPublisher } from "./infrastructure/publishers/MediumPublisher.mjs";
import { AstroMarkdownPostRepository } from "./infrastructure/repositories/AstroMarkdownPostRepository.mjs";
import { FilePublicationStateRepository } from "./infrastructure/repositories/FilePublicationStateRepository.mjs";

const args = process.argv.slice(2);
const hasFlag = (flag) => args.includes(flag);
const getFlagValue = (prefix) => {
  const found = args.find((arg) => arg.startsWith(`${prefix}=`));
  return found ? found.slice(prefix.length + 1) : undefined;
};

const all = hasFlag("--all");
const dryRun = hasFlag("--dry-run");
const explicitPlatforms = getFlagValue("--platform")
  ?.split(",")
  .map((v) => v.trim())
  .filter(Boolean);

const changedFiles = (process.env.CROSSPOST_CHANGED_FILES ?? "")
  .split("\n")
  .map((v) => v.trim())
  .filter(Boolean);

const siteUrl = process.env.SITE_URL || "https://francgs.dev";
const contentDir = process.env.CROSSPOST_CONTENT_DIR || "src/data/blog";
const statePath = process.env.CROSSPOST_STATE_PATH || ".crosspost/state.json";
const devToPublish = (process.env.CROSSPOST_DEVTO_PUBLISHED || "true") === "true";
const mediumStatus = process.env.CROSSPOST_MEDIUM_STATUS || "public";

const availablePublishers = {
  devto: new DevToPublisher({
    apiKey: process.env.DEVTO_API_KEY,
    publish: devToPublish,
  }),
  medium: new MediumPublisher({
    token: process.env.MEDIUM_TOKEN,
    publishStatus: mediumStatus,
  }),
};

const selectedPlatforms =
  explicitPlatforms?.length > 0 ? explicitPlatforms : Object.keys(availablePublishers);

const publishers = selectedPlatforms
  .map((platform) => availablePublishers[platform])
  .filter(Boolean);

if (publishers.length === 0) {
  console.log("No valid platforms selected. Use --platform=devto,medium");
  process.exit(0);
}

const postRepository = new AstroMarkdownPostRepository({ contentDir, siteUrl });
const stateRepository = new FilePublicationStateRepository({ filePath: statePath });

const useCase = new CrossPostArticlesUseCase({
  postRepository,
  stateRepository,
  publishers,
  logger: console,
});

const main = async () => {
  console.log("Cross-post starting...");
  console.log(`- all: ${all}`);
  console.log(`- dryRun: ${dryRun}`);
  console.log(`- platforms: ${selectedPlatforms.join(", ")}`);
  console.log(`- changedFiles: ${changedFiles.length}`);

  const summary = await useCase.execute({
    all,
    dryRun,
    changedFiles,
  });

  console.log("\nCross-post summary:");
  console.log(`- totalPosts: ${summary.totalPosts}`);
  console.log(`- published: ${summary.published}`);
  console.log(`- skipped: ${summary.skipped}`);
  console.log(`- failed: ${summary.failed}`);

  if (summary.failed > 0) {
    process.exitCode = 1;
  }
};

main().catch((error) => {
  console.error("Cross-post fatal error", error);
  process.exit(1);
});
