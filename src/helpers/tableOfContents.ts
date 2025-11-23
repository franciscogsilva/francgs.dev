export interface HeadingItem {
  depth: number;
  slug: string;
  text: string;
}

/**
 * Extract table of contents from markdown headings
 * @param headings - Array of heading objects from Astro
 * @returns Structured array of heading items
 */
export function getTableOfContents(
  headings: Array<{ depth: number; slug: string; text: string }>
): HeadingItem[] {
  // Filter to only include h2 and h3 headings (h1 is typically the page title)
  return headings.filter((heading) => heading.depth >= 2 && heading.depth <= 3);
}

/**
 * Generate a slug from text
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
