import { NextRequest } from 'next/server';
import { admin } from '@/lib/firebase-admin';

export async function getUser(request: NextRequest): Promise<string> {
  // Get and verify Firebase ID token from authorization header
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization header with Bearer token is required");
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
} 