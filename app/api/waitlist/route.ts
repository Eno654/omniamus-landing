export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { Client } from "pg";
import { sendMail } from "../../../lib/mailer";

function getClientIp(req: Request): string | null {
    const xff = req.headers.get("x-forwarded-for");
    if (xff) return xff.split(",")[0].trim();
    return req.headers.get("x-real-ip");
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));

        const email = (body?.email || "").toString().trim().toLowerCase();
        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }

        const username = body?.username ? body.username.toString().trim() : null;
        const role = (body?.role || "Viewer").toString().trim();
        const source = (body?.source || "landing").toString().trim();
        const country = body?.country ? body.country.toString().trim() : null;
        const ageConfirmed = Boolean(body?.ageConfirmed);
        const ageText = (body?.ageText || "").toString().trim();
        const consent = Boolean(body?.consent);
        const consentText = (body?.consentText || "").toString().trim();

        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            return NextResponse.json({ error: "Database not configured" }, { status: 500 });
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
        const expiresMinutes = 60 * 24; // 24h

        const ip = getClientIp(req);
        const userAgent = req.headers.get("user-agent") || null;

        const client = new Client({
	connectionString: dbUrl,
	ssl: { rejectUnauthorized: false },
	});

        await client.connect();

        await client.query(
            `
      INSERT INTO waitlist (
        email, username, role, source, country,
        age_confirmed, age_text, consent, consent_text,
        ip, user_agent, token_hash, token_expires_at
      )
      VALUES (
        $1,$2,$3,$4,$5,
        $6,$7,$8,$9,
        $10,$11,$12, NOW() + INTERVAL '${expiresMinutes} minutes'
      )
      ON CONFLICT (email) DO NOTHING
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
            ]
        );

        await client.end();

        // ---------- EMAIL ----------
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
            emailSent: Array.isArray(mailResult.accepted) && mailResult.accepted.length > 0,
        });

    } catch (err) {
        console.error("WAITLIST ERROR:", err);
        return NextResponse.json(
            { ok: false, error: "Server error" },
            { status: 500 }
        );
    }
}
