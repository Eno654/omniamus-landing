export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { Client } from "pg";
// IMPORTANT: import relativ, nu @/
import { sendMail } from "../../../../lib/mailer";

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const token = url.searchParams.get("token") || "";
    if (!token) {
      return NextResponse.redirect(new URL("/confirm?status=invalid", url.origin));
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.redirect(new URL("/confirm?status=server_error", url.origin));
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const client = new Client({ connectionString: dbUrl });
    await client.connect();

    // Găsim entry-ul neconfirmat + neexpirat
    const res = await client.query(
      `
      SELECT id, email, token_expires_at
      FROM waitlist
      WHERE token_hash = $1
      LIMIT 1
      `,
      [tokenHash]
    );

    if (res.rows.length === 0) {
      await client.end();
      return NextResponse.redirect(new URL("/confirm?status=invalid", url.origin));
    }

    const row = res.rows[0];
    const id = row.id as number;
    const email = row.email as string;
    const expiresAt = row.token_expires_at ? new Date(row.token_expires_at) : null;

    if (!expiresAt || expiresAt.getTime() < Date.now()) {
      await client.end();
      return NextResponse.redirect(new URL("/confirm?status=expired", url.origin));
    }

    // Confirmăm
    await client.query(
      `
      UPDATE waitlist
      SET confirmed_at = NOW(),
          token_hash = NULL,
          token_expires_at = NULL
      WHERE id = $1
      `,
      [id]
    );

    await client.end();

    // Email de bun venit (best-effort)
    try {
      const appUrl = process.env.APP_URL || url.origin;

      await sendMail({
        to: email,
        subject: "You're confirmed — Omniamus Early Access",
        text:
          `You're confirmed. Thanks for joining Omniamus early access.\n\n` +
          `We’ll email you when your access is ready.\n\n` +
          `${appUrl}\n`,
        html: `
          <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.5">
            <h2>You’re confirmed ✅</h2>
            <p>Thanks for joining Omniamus early access.</p>
            <p>We’ll email you when your access is ready.</p>
            <p style="margin-top:16px">
              <a href="${appUrl}" style="color:#000;text-decoration:underline;font-weight:600">Visit Omniamus</a>
            </p>
          </div>
        `,
      });
    } catch (e) {
      console.error("WELCOME EMAIL FAILED:", e);
      // nu blocăm confirmarea
    }

    return NextResponse.redirect(new URL("/confirm?status=ok", url.origin));
  } catch (err) {
    console.error("CONFIRM ROUTE ERROR:", err);
    return NextResponse.redirect(new URL("/confirm?status=server_error", url.origin));
  }
}
