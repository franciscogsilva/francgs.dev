export const prerender = false;

export async function GET({ request }: { request: Request }) {
  // Basic security check: Ensure request comes from our own domain
  const referer = request.headers.get('referer');
  const allowedDomain = import.meta.env.SITE_URL || 'francgs.dev';
  
  if (!referer || (!referer.includes(allowedDomain) && !referer.includes('localhost'))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const accessKey = import.meta.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ key: accessKey }), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store' // Don't cache the key
    }
  });
}
