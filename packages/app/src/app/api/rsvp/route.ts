import { NextRequest, NextResponse } from 'next/server';

interface RsvpField {
  label: string;
  value: string;
}

interface RsvpPayload {
  siteId: string;
  coupleName: string;
  notifyEmails: string[];
  fields: RsvpField[];
}

export async function POST(request: NextRequest) {
  try {
    const body: RsvpPayload = await request.json();
    const { siteId, coupleName, notifyEmails, fields } = body;

    if (!siteId || !notifyEmails?.length || !fields?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = notifyEmails.filter(e => emailRegex.test(e));
    if (validEmails.length === 0) {
      return NextResponse.json({ error: 'No valid notification emails configured' }, { status: 400 });
    }

    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.error('BREVO_API_KEY is not configured');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    // Build the email HTML from submitted fields
    const fieldsHtml = fields
      .map(f => `<tr><td style="padding:8px 12px;border-bottom:1px solid #f0ece8;font-weight:600;color:#44403c;width:35%;vertical-align:top;">${escapeHtml(f.label)}</td><td style="padding:8px 12px;border-bottom:1px solid #f0ece8;color:#57534e;">${escapeHtml(f.value || '—')}</td></tr>`)
      .join('');

    const htmlContent = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="font-size:24px;color:#292524;margin:0 0 4px;">New RSVP Response</h1>
          <p style="color:#a8a29e;font-size:14px;margin:0;">${escapeHtml(coupleName)}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;background:#fafaf9;border-radius:12px;overflow:hidden;">
          ${fieldsHtml}
        </table>
        <p style="text-align:center;color:#a8a29e;font-size:12px;margin-top:24px;">
          Sent from your wedding site on <a href="https://wdng.online" style="color:#d97706;">wdng.online</a>
        </p>
      </div>
    `;

    // Find a guest name from the fields for the subject line
    const guestName = fields.find(f => f.label.toLowerCase().includes('name'))?.value || 'A guest';

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify({
        sender: { name: 'WDNG.online', email: 'wdng.online@gmail.com' },
        to: validEmails.map(email => ({ email })),
        subject: `New RSVP from ${guestName} — ${coupleName}`,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Brevo API error:', errorData);
      return NextResponse.json({ error: 'Failed to send notification email' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
