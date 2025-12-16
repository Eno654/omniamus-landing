import nodemailer from "nodemailer";

type SendMailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendMail({ to, subject, html, text }: SendMailParams) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  // Fail-soft: dacă nu e configurat SMTP, nu blocăm flow-ul
  if (!host || !user || !pass || !from) {
    return {
      sent: false,
      reason: "SMTP not configured",
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true doar pentru SMTPS
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return { sent: true };
}
