import nodemailer from "nodemailer";

type SendMailArgs = {
  to: string;
  subject: string;
  html: string;
};

export async function sendMail({ to, subject, html }: SendMailArgs) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error("SMTP not configured (missing SMTP_HOST/SMTP_USER/SMTP_PASS)");
  }

  // ✅ Config corect pentru port 587 (STARTTLS)
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,      // IMPORTANT: 587 = STARTTLS, nu SMTPS direct
    requireTLS: true,   // forțează upgrade TLS
    auth: { user: smtpUser, pass: smtpPass },
    tls: {
      servername: smtpHost,  // ajută SNI
      minVersion: "TLSv1.2",
      // Dacă după asta încă vezi SELF_SIGNED_CERT_IN_CHAIN, atunci:
      // rejectUnauthorized: false,
    },
  });

  // verify poate fi păstrat (bun pentru debugging)
  await transporter.verify();

  await transporter.sendMail({
    from: fromEmail,
    to,
    subject,
    html,
  });
}
