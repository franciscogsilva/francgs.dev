import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = (
    await getCollection("blog", ({ data }) => !data.draft)
  ).sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  const items = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.pubDate,
    link: `/blog/${post.id}/`,
    content: post.body,
  }));

  return rss({
    title: "Francisco Gonzalez | Medium Syndication Feed",
    description:
      "Full-content RSS feed for syndication workflows (Medium/partners).",
    site: context.site,
    items,
  });
}
