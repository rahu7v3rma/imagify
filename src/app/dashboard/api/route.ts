import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
// import { getUserProfile } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          data: null,
        },
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.substring(7);

    // Decode token using jwt
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          data: null,
        },
        { status: 401 }
      );
    }

    // Get user profile by auth_token
    // const userProfile = await getUserProfile(token);
    const userProfile = null; // Temporary fallback
    
    if (!userProfile) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          data: null,
        },
        { status: 401 }
      );
    }

    // Return email and credits
    return NextResponse.json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        email:' userProfile.email',
        credits: 'userProfile.credits',
      },
    });

  } catch (error: any) {
    console.error('Dashboard API error:', error);

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