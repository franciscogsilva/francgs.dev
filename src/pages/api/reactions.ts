export const prerender = false;

import { supabaseServer } from "../../lib/supabase";
import { checkRateLimit, logReaction } from "../../lib/rateLimit";

const VALID_REACTIONS = ["love", "clap", "target", "idea"];

/** Only allow article IDs matching our URL patterns */
const ARTICLE_ID_REGEX = /^\/(?:blog|snippets)\/[\w-]+\/?$/;

function isValidArticleId(id: string): boolean {
  return ARTICLE_ID_REGEX.test(id) && id.length <= 150;
}

function buildReactionsMap(data: { reaction_type: string; count: number }[] | null): Record<string, number> {
  const reactions: Record<string, number> = {};
  VALID_REACTIONS.forEach((type) => {
    reactions[type] = 0;
  });
  data?.forEach((row) => {
    reactions[row.reaction_type] = row.count;
  });
  return reactions;
}

export async function GET({ url }: { url: URL }) {
  const articleId = url.searchParams.get("articleId");

  if (!articleId) {
    return new Response(JSON.stringify({ error: "Missing articleId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!isValidArticleId(articleId)) {
    return new Response(JSON.stringify({ error: "Invalid articleId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { data, error } = await supabaseServer
      .from("reactions")
      .select("reaction_type, count")
      .eq("article_id", articleId);

    if (error) throw error;

    return new Response(JSON.stringify(buildReactionsMap(data)), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to fetch reactions" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST({ request }: { request: Request }) {
  try {
    const data = await request.json();
    const { articleId, reactionType } = data;

    if (!articleId || !reactionType) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!isValidArticleId(articleId)) {
      return new Response(JSON.stringify({ error: "Invalid articleId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!VALID_REACTIONS.includes(reactionType)) {
      return new Response(
        JSON.stringify({ error: "Invalid reaction type" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get client IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    const rateLimitResult = await checkRateLimit(articleId, reactionType, ip);
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ error: rateLimitResult.message }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // Increment reaction count
    const { error: upsertError } = await supabaseServer
      .from("reactions")
      .upsert(
        {
          article_id: articleId,
          reaction_type: reactionType,
          count: 1,
        },
        {
          onConflict: "article_id,reaction_type",
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (upsertError) {
      // If record exists, increment
      const { error: incrementError } = await supabaseServer.rpc(
        "increment_reaction",
        {
          p_article_id: articleId,
          p_reaction_type: reactionType,
        }
      );

      if (incrementError) throw incrementError;
    }

    // Log the reaction for rate limiting
    await logReaction(articleId, reactionType, ip);

    // Get updated counts
    const { data: updatedData } = await supabaseServer
      .from("reactions")
      .select("reaction_type, count")
      .eq("article_id", articleId);

    return new Response(
      JSON.stringify({ success: true, reactions: buildReactionsMap(updatedData) }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to add reaction" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
