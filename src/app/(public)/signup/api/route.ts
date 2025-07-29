import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import validator from 'validator';
// import { createUser, createUserProfile } from '@/lib/firebase';
import { sendVerificationEmail } from '@/lib/email';

const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .refine((password) => validator.isStrongPassword(password), {
        message:
          'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol',
      }),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms and privacy policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          code: 'validation_failed',
          data: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Create user with Firebase Admin
    // const userRecord = await createUser(email, password);

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create user profile with verification code
    // await createUserProfile(userRecord.uid, email, verificationCode);

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email for verification.',
      data: null,
    });

  } catch (error: any) {
    console.error('Signup error:', error);

    // Handle Firebase Auth errors
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        {
          success: false,
          message: 'Email already in use',
          data: null,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        data: null,
      },
      { status: 500 }
    );
  }
}