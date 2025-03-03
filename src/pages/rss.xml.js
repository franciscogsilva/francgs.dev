import rss, { pagesGlobToRssItems } from "@astrojs/rss";

export async function GET(context) {
  // Obtener los items del blog
  const items = await pagesGlobToRssItems(import.meta.glob("./blog/*.md"));

  // Ordenar los posts del más nuevo al más antiguo
  items.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  return rss({
    title: "Francisco Gonzalez | Blog",
    description: "My journey about tech",
    site: context.site,
    items,
    customData: `<language>es-CO</language>`,
  });
}
