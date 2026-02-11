type PostLike = {
  id: string;
  data: {
    pubDate: Date;
  };
};

export const sortPostsByPubDateDesc = <T extends PostLike>(posts: T[]): T[] =>
  [...posts].sort((a, b) => {
    const byDate = b.data.pubDate.getTime() - a.data.pubDate.getTime();
    if (byDate !== 0) return byDate;
    return b.id.localeCompare(a.id);
  });
