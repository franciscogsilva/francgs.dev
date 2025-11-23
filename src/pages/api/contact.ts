export const prerender = false;

export async function POST({ request }: { request: Request }) {
  try {
    const data = await request.formData();
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');

    // Validate
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ success: false, message: 'Missing fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Send to Web3Forms
    const formData = new FormData();
    formData.append('access_key', import.meta.env.WEB3FORMS_ACCESS_KEY);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('subject', 'New Contact Form Submission from francgs.dev');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: response.ok ? 200 : 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
