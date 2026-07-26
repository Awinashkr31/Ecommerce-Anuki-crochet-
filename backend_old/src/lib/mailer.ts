import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

async function createTransporter() {
  if (transporter) return transporter;

  // Use Ethereal for testing
  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return transporter;
}

export async function sendOtpEmail(to: string, otp: string) {
  const mailer = await createTransporter();
  const info = await mailer.sendMail({
    from: '"Handmade Crochet Auth" <no-reply@crochetstore.com>',
    to,
    subject: 'Your Login Code',
    text: `Your 4-digit login code is: ${otp}. It will expire in 5 minutes.`,
    html: `<b>Your 4-digit login code is: ${otp}</b><br/><p>It will expire in 5 minutes.</p>`,
  });

  console.log('Message sent: %s', info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
  return nodemailer.getTestMessageUrl(info);
}
