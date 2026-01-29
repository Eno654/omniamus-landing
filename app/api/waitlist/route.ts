import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : null;

// Send confirmation email via Resend
async function sendConfirmationEmail(email: string, username: string | null) {
  if (!process.env.RESEND_API_KEY) {
    console.log("No RESEND_API_KEY, skipping email");
    return;
  }

  const usernameText = username 
    ? `Your requested username: <strong>@${username}</strong><br>We'll confirm availability within 24 hours.`
    : `You'll be notified when Omniamus launches.`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Omniamus <noreply@omniamus.com>",
        to: email,
        subject: username 
          ? `Welcome to Omniamus – @${username} reserved!`
          : "Welcome to Omniamus – You're on the list!",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #0b0d12; margin-bottom: 24px;">Welcome to Omniamus!</h1>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Thank you for joining the waitlist. You're now part of a community that believes content value should be measured after consumption, not before.
            </p>
            
            <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
                ${usernameText}
              </p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              <strong>What's next?</strong><br>
              We'll send you updates as we approach launch. No spam, ever.
            </p>

            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              In the meantime, you can support our campaign:<br>
              <a href="https://www.indiegogo.com/projects/omniamus" style="color: #2563eb;">Support on IndieGoGo</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
            
            <p style="color: #9ca3af; font-size: 14px;">
              <strong>Omniamus</strong><br>
              Truth. Reward. Freedom.<br>
              <a href="https://www.omniamus.com" style="color: #9ca3af;">www.omniamus.com</a>
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend error:", error);
    } else {
      console.log("Confirmation email sent to:", email);
    }
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, role, country } = body;

    // Validation
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    if (!role || !["creator", "viewer", "both"].includes(role)) {
      return NextResponse.json({ error: "Role must be creator, viewer, or both" }, { status: 400 });
    }

    // Clean username (remove @ if present, lowercase)
    const cleanUsername = username?.trim().toLowerCase().replace(/^@/, "") || null;

    // Validate username format if provided
    if (cleanUsername && !/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
      return NextResponse.json({ 
        error: "Username must be 3-20 characters, only letters, numbers, and underscores" 
      }, { status: 400 });
    }

    if (!pool) {
      console.log("No DATABASE_URL, returning success without storing");
      return NextResponse.json({ 
        success: true, 
        stored: false, 
        message: "Received (no database configured)" 
      });
    }

    // Check if email already exists
    const existingEmail = await pool.query(
      "SELECT id FROM waitlist WHERE email = $1",
      [email.toLowerCase().trim()]
    );

    if (existingEmail.rows.length > 0) {
      return NextResponse.json({ 
        error: "This email is already on the waitlist!" 
      }, { status: 409 });
    }

    // Check if username already taken (in waitlist)
    if (cleanUsername) {
      const existingUsername = await pool.query(
        "SELECT id FROM waitlist WHERE username = $1",
        [cleanUsername]
      );

      if (existingUsername.rows.length > 0) {
        return NextResponse.json({ 
          error: "This username is already reserved. Try another one!" 
        }, { status: 409 });
      }
    }

    // Insert into waitlist
    const result = await pool.query(
      `INSERT INTO waitlist (email, username, role, country, source, created_at)
       VALUES ($1, $2, $3, $4, $5, now())
       RETURNING id, email, username`,
      [
        email.toLowerCase().trim(),
        cleanUsername,
        role,
        country?.trim() || null,
        "landing"
      ]
    );

    // Send confirmation email (don't await - fire and forget)
    sendConfirmationEmail(result.rows[0].email, result.rows[0].username);

    return NextResponse.json({ 
      success: true, 
      stored: true,
      data: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        username: result.rows[0].username
      },
      message: cleanUsername 
        ? "You're on the list! We'll confirm your username within 24 hours."
        : "You're on the list! We'll notify you when we launch."
    });

  } catch (error: any) {
    console.error("Waitlist error:", error);
    
    // Handle unique constraint violations
    if (error.code === "23505") {
      if (error.constraint?.includes("email")) {
        return NextResponse.json({ error: "This email is already on the waitlist!" }, { status: 409 });
      }
      if (error.constraint?.includes("username")) {
        return NextResponse.json({ error: "This username is already reserved!" }, { status: 409 });
      }
    }

    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
