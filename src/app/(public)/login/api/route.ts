import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
// import { getUserWithEmailPassword, updateUserProfile } from "@/lib/firebase";
import { generateJWT } from "@/lib/jwt";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          code: "validation_failed",
          data: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Get user with email and password using Firebase Client SDK
    // const user = await getUserWithEmailPassword(email, password);

    // Check if email is verified
    // if (!user.emailVerified) {
    //   throw new Error("Email not verified");
    // }

    // Generate JWT token
    // const authToken = generateJWT(user.uid);

    // Save auth token to user profile
    // await updateUserProfile(user.uid, {
    //   auth_token: authToken,
    // });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      data: null,
    });

    // Set cookie
    response.cookies.set("imagify.auth.token", 'authToken', {
      httpOnly: true,
      secure: process.env.APP_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);

    // Handle email not verified error
    if (error.message === "Email not verified") {
      return NextResponse.json(
        {
          success: false,
          message: "Please verify your email before logging in",
          code: "email_not_verified",
          data: null,
        },
        { status: 400 }
      );
    }

    // Handle Firebase Auth errors - any authentication error is treated as invalid credentials
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/invalid-credential" ||
      error.code === "auth/user-disabled"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
          data: null,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        data: null,
      },
      { status: 500 }
    );
  }
}
