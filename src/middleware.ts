import { defineMiddleware } from "astro:middleware";
import { BLOG_SLUG_LANG_MAP } from "./data/blogSlugLangMap";

const ALLOWED_ORIGIN = "https://francgs.dev";
const SUPPORTED_LANGS = new Set(["en", "es"]);
const LANG_COOKIE = "site_lang";

const LEGACY_BLOG_REDIRECTS: Record<string, string> = {
  "/blog/05-install-mongodb-ubuntu-20.04":
    "/blog/05-install-mongodb-ubuntu-2004/",
  "/blog/06-Cannot-find-name-describe-Do-you-need-to-install-type-definitions-for-a-test-runner":
    "/blog/06-cannot-find-name-describe-do-you-need-to-install-type-definitions-for-a-test-runner/",
  "/blog/07-Solving-Docker-Permission-Issues-in-Node.js-Projects-A-Guide-to-Overcoming-EACCES-Errors-in-Volumes":
    "/blog/07-solving-docker-permission-issues-in-nodejs-projects-a-guide-to-overcoming-eacces-errors-in-volumes/",
  "/blog/08-Easily-accessing-the-project-root-directory-from-any-file-in-Typescript-and-Javascript":
    "/blog/08-easily-accessing-the-project-root-directory-from-any-file-in-typescript-and-javascript/",
  "/blog/09-Install-laravel-ubuntu-20.04":
    "/blog/09-install-laravel-ubuntu-2004/",
  "/blog/11-How-to-setup-multiple-git-accounts-with-SSH":
    "/blog/11-how-to-setup-multiple-git-accounts-with-ssh/",
  "/blog/12-How-to-add-multiple-git-remotes-repositories-to-my-code":
    "/blog/12-how-to-add-multiple-git-remotes-repositories-to-my-code/",
  "/blog/13-Syncing-and-signing-commits-for-different-REMOTES-and-different-GIT-accounts-using-HOOKS-from-a-single-local-repository":
    "/blog/13-syncing-and-signing-commits-for-different-remotes-and-different-git-accounts-using-hooks-from-a-single-local-repository/",
  "/blog/14-Google-Maps-Autocomplete-Limitation-Tutorial":
    "/blog/14-google-maps-autocomplete-limitation-tutorial/",
  "/blog/16-Optimizing-disk-space-on-LINUX-and-program-to-run-ONE-TIME-a-MONTH":
    "/blog/16-optimizing-disk-space-on-linux-and-program-to-run-one-time-a-month/",
  "/blog/17-setting-default-audio-device-at-session-start-on-ubuntu-22.04":
    "/blog/17-setting-default-audio-device-at-session-start-on-ubuntu-2204/",
  "/blog/18-solution-ethernet-speed-limitation-on-ubuntu-22.04":
    "/blog/18-solution-ethernet-speed-limitation-on-ubuntu-2204/",
  "/blog/19-razer-device-configuration-ubuntu-22.04":
    "/blog/19-razer-device-configuration-ubuntu-2204/",
  "/blog/21-how-to-install-cursor-ai-on-ubuntu-24.04":
    "/blog/21-how-to-install-cursor-ai-on-ubuntu-2404/",
  "/blog/23-custom-terminal-setup-kitty-ranger-on-ubuntu-24.04":
    "/blog/23-custom-terminal-setup-kitty-ranger-on-ubuntu-2404/",
};

const normalizePath = (path: string): string => {
  if (path !== "/" && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
};

const detectLangFromHeader = (acceptLanguageHeader: string | null): "en" | "es" => {
  if (!acceptLanguageHeader) return "en";
  const lower = acceptLanguageHeader.toLowerCase();
  return lower.includes("es") ? "es" : "en";
};

const resolvePreferredLang = (
  cookieLang: string | undefined,
  acceptLanguageHeader: string | null
): "en" | "es" => {
  if (cookieLang && SUPPORTED_LANGS.has(cookieLang)) {
    return cookieLang as "en" | "es";
  }
  return detectLangFromHeader(acceptLanguageHeader);
};

/**
 * Security middleware - sets HTTP security headers on all responses
 * and handles CORS for API endpoints.
 */
export const onRequest = defineMiddleware(async (_context, next) => {
  const url = new URL(_context.request.url);
  const normalizedPath = normalizePath(url.pathname);

  const cookieLang = _context.cookies.get(LANG_COOKIE)?.value;
  const preferredLang = resolvePreferredLang(
    cookieLang,
    _context.request.headers.get("accept-language")
  );

  const langPrefixMatch = normalizedPath.match(/^\/(en|es)(\/|$)/);
  if (langPrefixMatch) {
    const currentLang = langPrefixMatch[1] as "en" | "es";
    if (cookieLang !== currentLang) {
      _context.cookies.set(LANG_COOKIE, currentLang, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
        secure: import.meta.env.PROD,
      });
    }
  }

  if (normalizedPath === "/") {
    return Response.redirect(new URL(`/${preferredLang}/${url.search}`, url.origin), 302);
  }

  if (normalizedPath === "/blog") {
    return Response.redirect(
      new URL(`/${preferredLang}/blog/${url.search}`, url.origin),
      302
    );
  }

  if (normalizedPath === "/blog/category") {
    return Response.redirect(
      new URL(`/${preferredLang}/blog/category/${url.search}`, url.origin),
      302
    );
  }

  if (normalizedPath === "/tags") {
    return Response.redirect(
      new URL(`/${preferredLang}/tags/${url.search}`, url.origin),
      302
    );
  }

  const tagPathMatch = normalizedPath.match(/^\/tags\/([^/]+)$/);
  if (tagPathMatch) {
    return Response.redirect(
      new URL(`/${preferredLang}/tags/${tagPathMatch[1]}/${url.search}`, url.origin),
      302
    );
  }

  const categoryPathMatch = normalizedPath.match(/^\/blog\/category\/([^/]+)$/);
  if (categoryPathMatch) {
    return Response.redirect(
      new URL(
        `/${preferredLang}/blog/category/${categoryPathMatch[1]}/${url.search}`,
        url.origin
      ),
      302
    );
  }

  const redirectTarget = LEGACY_BLOG_REDIRECTS[normalizedPath];
  if (redirectTarget) {
    return Response.redirect(new URL(`${redirectTarget}${url.search}`, url.origin), 301);
  }

  const blogMatch = normalizedPath.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const requestedSlug = blogMatch[1].toLowerCase();
    const lang = BLOG_SLUG_LANG_MAP[requestedSlug];
    if (lang) {
      return Response.redirect(
        new URL(`/${lang}/blog/${requestedSlug}/${url.search}`, url.origin),
        301
      );
    }
  }

  const response = await next();
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
