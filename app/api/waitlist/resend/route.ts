import { NextResponse } from "next/server";
import { Client } from "pg";
import crypto from "crypto";
import { sendMail } from "../../../../lib/mailer";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body?.email || "").toString().trim().toLowerCase();

    // Răspuns “non-enumeration”: nu confirmăm dacă emailul există sau nu.
    const genericOk = NextResponse.json({ ok: true });

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return genericOk;
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) return genericOk;

    const client = new Client({ connectionString: dbUrl });
    await client.connect();

    // Asigură coloanele (idempotent)
    await client.query(`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS confirm_token_hash TEXT;`);
    await client.query(`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS confirm_expires_at TIMESTAMPTZ;`);
    await client.query(`ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;`);
    await client.query(`CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist (email);`);
    await client.query(`CREATE INDEX IF NOT EXISTS waitlist_confirm_token_idx ON waitlist (confirm_token_hash);`);

    // Dacă e deja confirmat, nu mai trimitem (dar răspundem ok).
    const confirmed = await client.query(
      `SELECT id FROM waitlist WHERE email = $1 AND confirmed_at IS NOT NULL LIMIT 1;`,
      [email]
    );
    if (confirmed.rowCount > 0) {
      await client.end();
      return genericOk;
    }

    // Căutăm un rând pending (neconfirmat) pentru acest email
    const pending = await client.query(
      `
      SELECT id
      FROM waitlist
      WHERE email = $1 AND confirmed_at IS NULL
      ORDER BY created_at DESC
      LIMIT 1;
      `,
      [email]
    );

    if (pending.rowCount === 0) {
      await client.end();
      return genericOk;
    }

    const id = pending.rows[0].id as number;

    // Generează token nou + hash (stocăm doar hash)
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresMinutes = 60 * 24; // 24h

    // (Anti-abuse light) nu resend mai des de 2 minute:
    // Dacă vrei mai strict, zici și facem.
    const gate = await client.query(
      `
      SELECT
        confirm_expires_at,
        (now() - created_at) AS age
      FROM waitlist
      WHERE id = $1;
      `,
      [id]
    );
    // Nota: păstrăm simplu—nu blocăm hard; doar evităm spam dacă vrei.
    // În acest MVP, continuăm.

    // Update token pe rândul pending
    await client.query(
      `
      UPDATE waitlist
      SET confirm_token_hash = $1,
          confirm_expires_at = now() + ($2 || ' minutes')::interval
      WHERE id = $3;
      `,
      [tokenHash, String(expiresMinutes), id]
    );

    await client.end();

    // Trimite email (fail-soft)
    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const confirmUrl = `${appUrl}/api/waitlist/confirm?token=${rawToken}`;

    await sendMail({
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

    return genericOk;
  } catch {
    // Tot generic: nu dăm indicii
    return NextResponse.json({ ok: true });
  }
}
