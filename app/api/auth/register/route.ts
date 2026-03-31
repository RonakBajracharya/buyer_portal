import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { usersDB } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { validateRegistration } from "@/lib/validation";

// Simple UUID without external dep
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const errors = validateRegistration(body);

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    const { name, email, password } = body as {
      name: string;
      email: string;
      password: string;
    };

    // Check if email already taken
    const existing = usersDB.findByEmail(email);
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          errors: [{ field: "email", message: "An account with this email already exists" }],
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    const user = usersDB.create({
      id: generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: "buyer",
      createdAt: new Date().toISOString(),
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });

    // Set HttpOnly cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
