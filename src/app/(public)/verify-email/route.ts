import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendErrorEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const code = searchParams.get('code');

    if (!email || !code) {
      return NextResponse.redirect(
        new URL('/login?email_verified_failed=1', request.url),
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
        emailVerificationCode: code,
      },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL('/login?email_verified_failed=1', request.url),
      );
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
        emailVerificationCode: null,
        updatedAt: new Date().toISOString(),
      },
    });

    return NextResponse.redirect(
      new URL('/login?email_verified_success=1', request.url),
    );
  } catch (error: any) {
    if (process.env.APP_ENV === 'production') {
      sendErrorEmail({ error });
    } else {
      console.log('Error in verify email:', error);
    }
    return NextResponse.redirect(
      new URL('/login?email_verified_failed=1', request.url),
    );
  }
}
