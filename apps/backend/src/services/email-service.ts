import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'delivered@resend.dev';

export async function sendContactEmail(data: {
  name: string;
  email: string;
  message: string;
}) {
  if (!resend) {
    console.warn('Resend API key not configured, skipping email.');
    return;
  }

  try {
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: CONTACT_EMAIL,
      subject: `New message from ${data.name}`,
      replyTo: data.email,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send email via Resend:', error);
  }
}
