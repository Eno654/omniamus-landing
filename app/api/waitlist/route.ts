import { NextResponse } from "next/server";
import crypto from "crypto";
import { Client } from "pg";
import { sendMail } from "@/lib/mailer";

export const runtime = "nodejs";

function hashToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

function getAppUrl(req: Request) {
  // Prefer explicit APP_URL, fallback to request origin
  const envUrl = process.env.APP_URL?.trim();
  if (envUrl) return envUrl.replace(/\/+$/, "");
  const url = new URL(req.url);
  return url.origin;
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error("WAITLIST ERROR: Database not configured (missing DATABASE_URL)");
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const appUrl = getAppUrl(req);

    // Token: trimitem raw în email, stocăm doar hash în DB
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);

    const confirmUrl = `${appUrl}/api/waitlist/confirm?token=${rawToken}`;

    console.log("WAITLIST: step 1 - connect DB");
    const client = new Client({
      connectionString: dbUrl,
      // ✅ Fix pentru SELF_SIGNED_CERT_IN_CHAIN pe conexiunea Postgres (Supabase/Pooler)
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    console.log("WAITLIST: step 2 - insert waitlist row");
    // IMPORTANT: păstrez stilul tău: insert + “upsert-ish” prin catch/unique
    // Presupune tabel waitlist(email unique, token_hash, confirmed, created_at, confirmed_at etc.)
    // Ajustează doar numele tabelului/coloanelor dacă diferă la tine.
    await client.query(
      `
      INSERT INTO waitlist (email, token_hash, confirmed, created_at)
      VALUES ($1, $2, false, NOW())
      ON CONFLICT (email)
      DO UPDATE SET token_hash = EXCLUDED.token_hash, confirmed = false
      `,
      [email.toLowerCase(), tokenHash]
    );

    console.log("WAITLIST: step 3 - send mail");
    await sendMail({
      to: email,
      subject: "Confirm your Omniamus waitlist spot",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Confirm your email</h2>
          <p>Click the button below to confirm your spot on the Omniamus waitlist.</p>
          <p style="margin: 24px 0;">
            <a href="${confirmUrl}"
               style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:10px;">
              Confirm email
            </a>
          </p>
          <p>If the button doesn't work, copy and paste this link:</p>
          <p><a href="${confirmUrl}">${confirmUrl}</a></p>
        </div>
      `,
    });

    console.log("WAITLIST: step 4 - done");
    await client.end();

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("WAITLIST ERROR:", err);

    // Închide conexiunea dacă a apucat să existe
    // (Nu aruncăm dacă nu e definit)
    try {
      // @ts-ignore
      await globalThis.__waitlistClient?.end?.();
    } catch {}

    return NextResponse.json(
      {
        error: "Waitlist request failed",
        code: err?.code,
        message: err?.message,
      },
      { status: 500 }
    );
  }
}
