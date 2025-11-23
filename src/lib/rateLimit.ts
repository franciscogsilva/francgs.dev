import { supabaseServer } from './supabase';

interface RateLimitResult {
  allowed: boolean;
  message?: string;
}

// Hash IP for privacy
function hashIP(ip: string): string {
  // Simple hash - in production use crypto
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export async function checkRateLimit(
  articleId: string,
  reactionType: string,
  ip: string
): Promise<RateLimitResult> {
  const ipHash = hashIP(ip);
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  try {
    // Check if user already reacted to this article with this type
    const { data: existingReaction } = await supabaseServer
      .from('reaction_logs')
      .select('id')
      .eq('article_id', articleId)
      .eq('reaction_type', reactionType)
      .eq('ip_hash', ipHash)
      .single();

    if (existingReaction) {
      return {
        allowed: false,
        message: 'You already reacted with this emoji'
      };
    }

    // Check total reactions in last hour
    const { count } = await supabaseServer
      .from('reaction_logs')
      .select('*', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', oneHourAgo);

    if (count && count >= 10) {
      return {
        allowed: false,
        message: 'Rate limit exceeded. Try again later.'
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return { allowed: false, message: 'Error checking rate limit' };
  }
}

export async function logReaction(
  articleId: string,
  reactionType: string,
  ip: string
): Promise<void> {
  const ipHash = hashIP(ip);
  
  await supabaseServer
    .from('reaction_logs')
    .insert({
      article_id: articleId,
      reaction_type: reactionType,
      ip_hash: ipHash
    });
}
