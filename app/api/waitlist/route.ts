import { NextResponse } from "next/server";
import { Client } from "pg";
import crypto from "crypto";
import { sendMail } from "../../../lib/mailer";

function getClientIp(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || null;
  const xrip = req.headers.get("x-real-ip");
  return xrip?.trim() || null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const email = (body?.email || "").toString().trim().toLowerCase();
    const username = body?.username ? body.username.toString().trim() : null;
    const role = (body?.role || "Viewer").toString().trim();
    const source = (body?.source || "landing").toString().trim();

    const country = body?.country ? body.country.toString().trim() : null;

    const ageConfirmed = Boolean(body?.ageConfirmed);
    const ageText = (body?.ageText || "").toString().trim();

    const consent = Boolean(body?.consent);
    const consentText = (body?.consentText || "").toString().trim();

    // Basic validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }
    if (!["Creator", "Viewer", "Press"].includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }
    if (username && !/^[a-zA-Z0-9_\.]{3,30}$/.test(username)) {
      return NextResponse.json(
        { error: "Username must be 3–30 chars (letters, numbers, _ or .)." },
        { status: 400 }
      );
    }
    if (country && country.length > 56) {
      return NextResponse.json({ error: "Country is too long." }, { status: 400 });
    }

    // Required confirmations
    if (!ageConfirmed || !ageText) {
      return NextResponse.json({ error: "Age confirmation is required." }, { status: 400 });
    }
    if (!consent || !consentText) {
      return NextResponse.json({ error: "Consent is required." }, { status: 400 });
    }

    // DB fail-soft
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json({ ok: true, stored: false, emailSent: false });
    }

    // Generate confirm token (store hash only)
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresMinutes = 60 * 24; // 24h

    const ip = getClientIp(req);
    const userAgent = req.headers.get("user-agent") || null;

    const client = new Client({ connectionString: dbUrl });
    await client.connect();

    // Base table
    await client.query(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id BIGSERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        username TEXT,
        role TEXT NOT NULL,
        source TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    // Evolve schema safely (idempotent)
    await client.query(`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS country TEXT;`);

    await client.query(`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS age_confirmed BOOLEAN;`);
    await client.query(`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS age_text TEXT;`);
    await client.query(`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS age_at TIMESTAMPTZ;`);

    await client.query(`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS consent BOOLEAN;`);
    await client.query(`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS consent_text TEXT;`);
    await client.query(`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ;`);

    await client.query(`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS ip TEXT;`);
    await client.query(`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS user_agent TEXT;`);

    // Double opt-in light fields
    await client.query(`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS confirm_token_hash TEXT;`);
    await client.query(`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS confirm_expires_at TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;`);

    // Indexes
    await client.query(`CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist (email);`);
    await client.query(`CREATE INDEX IF NOT EXISTS waitlist_country_idx ON waitlist (country);`);
    await client.query(`CREATE INDEX IF NOT EXISTS waitlist_confirm_token_idx ON waitlist (confirm_token_hash);`);

    // Keep only ONE pending row per email (preserve confirmed history)
    await client.query(
      `DELETE FROM waitlist WHERE email = $1 AND confirmed_at IS NULL;`,
      [email]
    );

    // Insert new pending row with token hash + expiry
    await client.query(
      `
      INSERT INTO waitlist (
        email, username, role, source, country,
        age_confirmed, age_text, age_at,
        consent, consent_text, consent_at,
        ip, user_agent,
        confirm_token_hash, confirm_expires_at, confirmed_at
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, now(),
        $8, $9, now(),
        $10, $11,
        $12, now() + ($13 || ' minutes')::interval, NULL
      );
      `,
      [
        email,
        username,
        role,
        source,
        country,
        ageConfirmed,
        ageText,
        consent,
        consentText,
        ip,
        userAgent,
        tokenHash,
        String(expiresMinutes),
      ]
    );

    await client.end();

    // Send confirmation email (fail-soft)
    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const confirmUrl = `${appUrl}/api/waitlist/confirm?token=${rawToken}`;

    const mailResult = await sendMail({
      to: email,
      subject: "Confirm your Omniamus early access",
      text:
        `Confirm your email to join the Omniamus early access list:\n\n${confirmUrl}\n\n` +
        `If you didn’t request this, you can ignore this email. This link expires in 24 hours.`,
      html: `
        <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.5">
          <h2>Confirm your email</h2>
          <p>Click the button below to confirm your Omniamus early access signup.</p>
          <p style="margin:18px 0">
            <a href="${confirmUrl}"
               style="display:inline-block;padding:10px 14px;border-radius:10px;
                      background:#ffffff;color:#000;text-decoration:none;font-weight:600">
              Confirm email
            </a>
          </p>
          <p style="font-size:12px;opacity:0.7">
            If you didn’t request this, ignore this email. This link expires in 24 hours.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      stored: true,
      emailSent: Boolean((mailResult as any)?.sent),
    });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
