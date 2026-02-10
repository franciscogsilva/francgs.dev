import { defineMiddleware } from "astro:middleware";

const ALLOWED_ORIGIN = "https://francgs.dev";

/**
 * Security middleware - sets HTTP security headers on all responses
 * and handles CORS for API endpoints.
 */
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  const url = new URL(_context.request.url);
  const isApi = url.pathname.startsWith("/api/");

  // --- Security Headers ---
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://giscus.app https://us.umami.is",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self'",
      "frame-src https://giscus.app",
      "connect-src 'self' https://us.umami.is https://api.web3forms.com https://*.supabase.co",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );

  // --- CORS for API routes ---
  if (isApi) {
    const origin = _context.request.headers.get("origin");
    const isProd = import.meta.env.PROD;

    if (
      !isProd ||
      origin === ALLOWED_ORIGIN ||
      origin === null // same-origin requests don't send Origin header
    ) {
      response.headers.set(
        "Access-Control-Allow-Origin",
        isProd ? ALLOWED_ORIGIN : "*"
      );
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type"
      );
    }

    // Preflight
    if (_context.request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: response.headers });
    }
  }

  return response;
});
