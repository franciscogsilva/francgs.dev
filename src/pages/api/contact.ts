export const prerender = false;

export async function POST({ request }: { request: Request }) {
  console.log('POST /api/contact hit');
  try {
    const data = await request.formData();
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');
    
    console.log('Contact form data received:', { name, email, messageLength: message?.toString().length, message });

    // Validate
    if (!name || !email || !message) {
      console.warn('Missing fields in contact form');
      return new Response(JSON.stringify({ success: false, message: 'Missing fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const accessKey = import.meta.env.WEB3FORMS_ACCESS_KEY;
    console.log('Web3Forms Key present:', !!accessKey);

    if (!accessKey) {
      console.error('CRITICAL: Missing WEB3FORMS_ACCESS_KEY');
      throw new Error('Missing WEB3FORMS_ACCESS_KEY');
    }

    // Send to Web3Forms
    const formData = new FormData();
    formData.append('access_key', accessKey);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('subject', 'New Contact Form Submission from francgs.dev');
    
    // Add honeypot field if present
    const botcheck = data.get('botcheck');
    if (botcheck) {
      console.log('Botcheck field present:', botcheck);
      formData.append('botcheck', botcheck);
    }

    console.log('Sending to Web3Forms...');
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    let result;
    const responseText = await response.text();
    
    try {
      result = JSON.parse(responseText);
      console.log('Web3Forms response:', result);
    } catch (e) {
      console.error('Failed to parse Web3Forms response:', responseText);
      throw new Error('Invalid response from Web3Forms');
    }

    return new Response(JSON.stringify(result), {
      status: response.ok ? 200 : 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in contact API:', error);
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
