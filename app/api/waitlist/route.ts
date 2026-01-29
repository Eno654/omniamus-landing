import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : null;

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
