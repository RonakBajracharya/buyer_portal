import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { usersDB } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { validateLogin } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const errors = validateLogin(body);

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const { email, password } = body as { email: string; password: string };

    const user = usersDB.findByEmail(email);
    if (!user) {
      // Use generic message to avoid user enumeration
      return NextResponse.json(
        {
          success: false,
          errors: [{ field: "email", message: "Invalid email or password" }],
        },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          errors: [{ field: "password", message: "Invalid email or password" }],
        },
        { status: 401 }
      );
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
