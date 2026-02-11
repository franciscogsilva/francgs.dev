export const prerender = false;

/**
 * Server-side contact form validation endpoint.
 *
 * Flow:
 * 1. Client sends form data to /api/contact for validation
 * 2. Server validates all fields (length, format, honeypot)
 * 3. If valid, returns the access key so the client can submit
 *    directly to Web3Forms (required — their Cloudflare setup
 *    blocks server-to-server requests)
 *
 * The Web3Forms key is low-risk (write-only to owner's inbox),
 * but we still only return it after passing validation to prevent
 * automated abuse.
 */

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePayload(
  data: unknown
): { valid: true; payload: ContactPayload } | { valid: false; error: string } {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const { name, email, message, botcheck } = data as Record<string, unknown>;

  // Honeypot triggered — silently succeed to confuse bots
  if (botcheck) {
    return { valid: false, error: "__honeypot__" };
  }

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return { valid: false, error: "Name is required" };
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { valid: false, error: `Name must be under ${MAX_NAME_LENGTH} characters` };
  }

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    return { valid: false, error: "A valid email is required" };
  }
  if (email.length > MAX_EMAIL_LENGTH) {
    return { valid: false, error: `Email must be under ${MAX_EMAIL_LENGTH} characters` };
  }

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return { valid: false, error: "Message is required" };
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message must be under ${MAX_MESSAGE_LENGTH} characters`,
    };
  }

  return {
    valid: true,
    payload: {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    },
  };
}

export async function POST({ request }: { request: Request }) {
  try {
    const data = await request.json();
    const result = validatePayload(data);

    // Honeypot: fake success so bots think it worked
    if (!result.valid && result.error === "__honeypot__") {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!result.valid) {
      return new Response(
        JSON.stringify({ error: result.error }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const accessKey = import.meta.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return validated payload + key for client-side submission
    // (Web3Forms requires browser-origin requests due to Cloudflare)
    return new Response(
      JSON.stringify({
        validated: true,
        payload: {
          access_key: accessKey,
          subject: "New Contact Form Submission from francgs.dev",
          name: result.payload.name,
          email: result.payload.email,
          message: result.payload.message,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
