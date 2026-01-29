import nodemailer from "nodemailer";

type SendMailArgs = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
};

export async function sendMail({ to, subject, html, text }: SendMailArgs) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error("SMTP not configured (missing SMTP_HOST/SMTP_USER/SMTP_PASS)");
  }
  if (!html && !text) {
    throw new Error("Email content missing (provide html and/or text)");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false, // 587 = STARTTLS
    requireTLS: true,
    auth: { user: smtpUser, pass: smtpPass },
    tls: {
      servername: smtpHost,
      minVersion: "TLSv1.2",

      // SMTP TLS workaround (MVP)
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: fromEmail,
    to,
    subject,
    html,
    text,
  });
}
