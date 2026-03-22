import { supabaseServer } from "./supabase";

interface RateLimitResult {
  allowed: boolean;
  message?: string;
}

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REACTIONS_PER_HOUR = 10;
const HASH_SALT = import.meta.env.SUPABASE_SERVICE_KEY?.slice(0, 16) ?? "fallback-salt";

/**
 * SHA-256 hash with salt for privacy-preserving IP tracking.
 * Uses Web Crypto API (available on Cloudflare Workers and modern runtimes).
 */
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + HASH_SALT);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32); // 32 hex chars is sufficient
}

export async function checkRateLimit(
  articleId: string,
  reactionType: string,
  ip: string
): Promise<RateLimitResult> {
  const ipHash = await hashIP(ip);
  const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();

  try {
    // Check if user already reacted to this article with this type
    const { data: existingReaction } = await supabaseServer
      .from("reaction_logs")
      .select("id")
      .eq("article_id", articleId)
      .eq("reaction_type", reactionType)
      .eq("ip_hash", ipHash)
      .single();

    if (existingReaction) {
      return {
        allowed: false,
        message: "You already reacted with this emoji",
      };
    }

    // Check total reactions in last hour
    const { count } = await supabaseServer
      .from("reaction_logs")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", oneHourAgo);

    if (count && count >= MAX_REACTIONS_PER_HOUR) {
      return {
        allowed: false,
        message: "Rate limit exceeded. Try again later.",
      };
    }

    return { allowed: true };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Rate limit check error:", error);
    }
    return { allowed: false, message: "Error checking rate limit" };
  }
}

export async function logReaction(
  articleId: string,
  reactionType: string,
  ip: string
): Promise<void> {
  const ipHash = await hashIP(ip);

  await supabaseServer.from("reaction_logs").insert({
    article_id: articleId,
    reaction_type: reactionType,
    ip_hash: ipHash,
  });
}
