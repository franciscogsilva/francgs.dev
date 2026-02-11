import { createHash } from "node:crypto";
import { supabaseServer } from "./supabase";

interface RateLimitResult {
  allowed: boolean;
  message?: string;
}

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REACTIONS_PER_HOUR = 10;
const HASH_SALT = import.meta.env.SUPABASE_SERVICE_KEY?.slice(0, 16) ?? "fallback-salt";

/** SHA-256 hash with salt for privacy-preserving IP tracking */
function hashIP(ip: string): string {
  return createHash("sha256")
    .update(ip + HASH_SALT)
    .digest("hex")
    .slice(0, 32); // 32 hex chars is sufficient
}

export async function checkRateLimit(
  articleId: string,
  reactionType: string,
  ip: string
): Promise<RateLimitResult> {
  const ipHash = hashIP(ip);
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
  const ipHash = hashIP(ip);

  await supabaseServer.from("reaction_logs").insert({
    article_id: articleId,
    reaction_type: reactionType,
    ip_hash: ipHash,
  });
}
