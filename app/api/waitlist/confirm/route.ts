import { NextResponse } from "next/server";
import { Client } from "pg";
import crypto from "crypto";
import { sendMail } from "@/lib/mailer";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";

  if (!token || token.length < 20) {
    return NextResponse.redirect(new URL("/confirm?status=invalid", url.origin));
  }

  const db = process.env.DATABASE_URL;
  if (!db) {
    return NextResponse.redirect(new URL("/confirm?status=offline", url.origin));
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const client = new Client({ connectionString: db });
  await client.connect();

  // Confirmă doar dacă token valid + neexpirat + neconfirmat
  const result = await client.query(
    `
    UPDATE waitlist
    SET confirmed_at = now(), confirm_token_hash = NULL, confirm_expires_at = NULL
    WHERE confirm_token_hash = $1
      AND confirmed_at IS NULL
      AND (confirm_expires_at IS NULL OR confirm_expires_at > now())
    RETURNING id;
    `,
    [tokenHash]
  );

  await client.end();

if (result.rowCount === 1) {
  // Obține emailul confirmat
  const emailRes = await client.query(
    `SELECT email FROM waitlist WHERE confirm_token_hash IS NULL AND confirmed_at IS NOT NULL ORDER BY confirmed_at DESC LIMIT 1;`
  );

  const email = emailRes.rows[0]?.email;

  if (email) {
    await sendMail({
      to: email,
      subject: "Welcome to Omniamus",
      text:
        "Welcome,\n\n" +
        "Your email is confirmed. You’re officially on the Omniamus early access list.\n\n" +
        "Omniamus is being built deliberately and quietly.\n" +
        "We’ll only email you when there is something meaningful to share.\n\n" +
        "Thank you for being early,\n" +
        "Eno\nFounder, Omniamus",
      html: `
        <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.6">
          <h2>Welcome to Omniamus</h2>
          <p>Your email is confirmed. You’re officially on the Omniamus early access list.</p>
          <p>
            Omniamus is being built deliberately and quietly.<br />
            We’ll only email you when there is something meaningful to share.
          </p>
          <ul>
            <li>Early users will be invited first</li>
            <li>Reserved usernames will be honored</li>
            <li>No spam, no noise</li>
          </ul>
          <p style="font-size:13px;opacity:0.7">
            You can unsubscribe or request deletion at any time.
          </p>
          <p>
            Thank you for being early,<br />
            <b>Eno</b><br />
            Founder, Omniamus
          </p>
        </div>
      `,
    });
  }

  await client.end();
  return NextResponse.redirect(new URL("/confirm?status=ok", url.origin));
}


  return NextResponse.redirect(new URL("/confirm?status=expired", url.origin));
}
