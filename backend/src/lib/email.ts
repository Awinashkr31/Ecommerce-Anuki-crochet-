import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export const sendOrderConfirmationEmail = async (customerEmail: string, orderId: string, amount: number) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Crochet Store <orders@crochetstore.com>',
      to: [customerEmail],
      subject: `Order Confirmation - #${orderId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank you for your order!</h2>
          <p>We've received your order <strong>#${orderId}</strong> and are getting it ready for you.</p>
          <p>Since our products are handmade, please note the processing time specified on the product page.</p>
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p><strong>Total Paid:</strong> ₹${amount}</p>
          </div>
          <p>We'll send you another email when your order ships.</p>
          <p>Warmly,<br/>The Crochet Store Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to send email:', err);
    return false;
  }
};
