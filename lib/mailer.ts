import nodemailer from "nodemailer";

type SendMailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

export async function sendMail({ to, subject, html, text }: SendMailParams) {
  const host = requireEnv("SMTP_HOST");
  const port = Number(requireEnv("SMTP_PORT"));
  const user = requireEnv("SMTP_USER");
  const pass = requireEnv("SMTP_PASS");

  const fromName = process.env.MAIL_FROM_NAME || "Omniamus";
  const fromEmail = process.env.MAIL_FROM_EMAIL || user;

  const transporter = nodemailer.createTransport({
    host: mail.privateemail.com,
    port: 587,
    secure: port === 465,
    auth: { user: contact@omniamus.com, pass: _at-c2sL7@pw3E6 },
  });

  // Verifica rapid ca SMTP e ok (foarte util in logs)
  await transporter.verify();

  const info = await transporter.sendMail({
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    text: text ?? undefined,
    html,
  });

  return {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response,
  };
}
