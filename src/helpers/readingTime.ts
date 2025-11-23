/**
 * Calculate reading time for a given text
 * @param text - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Formatted reading time string
 */
export function calculateReadingTime(
  text: string,
  wordsPerMinute: number = 200
): string {
  // Remove markdown syntax and HTML tags for accurate word count
  const cleanText = text
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]*`/g, "") // Remove inline code
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[#*_~\[\]()]/g, "") // Remove markdown symbols
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[.*?\]\(.*?\)/g, ""); // Remove links

  // Count words
  const words = cleanText.trim().split(/\s+/).length;

  // Calculate reading time in minutes
  const minutes = Math.ceil(words / wordsPerMinute);

  // Format output
  if (minutes === 1) {
    return "1 minuto de lectura";
  } else {
    return `${minutes} minutos de lectura`;
  }
}

/**
 * Get reading time in minutes (numeric value)
 * @param text - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Number of minutes
 */
export function getReadingMinutes(
  text: string,
  wordsPerMinute: number = 200
): number {
  const cleanText = text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[#*_~\[\]()]/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "");

  const words = cleanText.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
