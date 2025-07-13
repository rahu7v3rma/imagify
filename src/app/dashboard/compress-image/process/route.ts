import {
  adminGetUserCredits,
  adminUpdateUserCredits,
  admin,
} from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { GoogleAuth } from "google-auth-library";
import axios from "axios";

const CREDIT_REQUIREMENT = 3;
const COMPRESS_SERVICE_URL = "https://compress-image-534705204397.us-central1.run.app/compress";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const requestSchema = z.object({
  imageUrl: z.string().url('Please provide a valid image URL'),
  quality: z.number().min(10).max(100).default(80),
});

// Service account configuration for Cloud Run authentication
const cloudRunServiceAccount = {
  type: "service_account",
  project_id: process.env.CLOUD_RUN_PROJECT_ID,
  private_key_id: process.env.CLOUD_RUN_PRIVATE_KEY_ID,
  private_key: process.env.CLOUD_RUN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.CLOUD_RUN_CLIENT_EMAIL,
  client_id: process.env.CLOUD_RUN_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.CLOUD_RUN_CLIENT_EMAIL}`,
  universe_domain: "googleapis.com",
};

// Initialize Google Auth for Cloud Run authentication with service account
const auth = new GoogleAuth({
  credentials: cloudRunServiceAccount,
});

// Function to get ID token for Cloud Run authentication
async function getIdToken(targetUrl: string): Promise<string> {
  try {
    const client = await auth.getIdTokenClient(targetUrl);
    const idToken = await client.idTokenProvider.fetchIdToken(targetUrl);
    return idToken;
  } catch (error) {
    throw new Error(`Failed to get ID token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to check file size from URL
async function checkFileSize(imageUrl: string): Promise<{ isValid: boolean; size?: number; error?: string }> {
  try {
    const response = await axios.head(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageCompressor/1.0)',
      },
      timeout: 10000, // 10 second timeout
    });

    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.startsWith('image/')) {
      return { isValid: false, error: 'URL does not point to a valid image file' };
    }

    const contentLength = response.headers['content-length'];
    if (!contentLength) {
      // If no content-length header, we can't determine size, so we'll allow it
      return { isValid: true };
    }

    const size = parseInt(contentLength, 10);
    if (size > MAX_FILE_SIZE) {
      return { isValid: false, size, error: `File size (${Math.round(size / 1024 / 1024)}MB) exceeds maximum allowed size (10MB)` };
    }

    return { isValid: true, size };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status) {
        return { isValid: false, error: `Unable to access image: ${status}` };
      }
    }
    return { isValid: false, error: `Failed to check file size: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

// Function to make authenticated request to Cloud Run
async function makeAuthenticatedRequest(url: string, data: any) {
  try {
    const idToken = await getIdToken(url);
    
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60 second timeout for image processing
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const statusText = error.response?.statusText;
      if (status && statusText) {
        throw new Error(`HTTP ${status}: ${statusText}`);
      }
    }
    throw new Error(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get and verify Firebase ID token from authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization header with Bearer token is required",
        },
        { status: 401 },
      );
    }

    const idToken = authHeader.split("Bearer ")[1];
    let userId: string;

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      userId = decodedToken.uid;
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Validate request body with Zod schema
    const validatedData = requestSchema.parse(body);

    // Check file size before proceeding with compression
    const fileSizeCheck = await checkFileSize(validatedData.imageUrl);
    if (!fileSizeCheck.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: fileSizeCheck.error || "File size validation failed",
        },
        { status: 400 },
      );
    }

    // Check user credits using Admin SDK
    const userCredits = await adminGetUserCredits(userId);
    if (!userCredits || userCredits.credits < CREDIT_REQUIREMENT) {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient credits",
        },
        { status: 400 },
      );
    }

    // Call the Express.js compress image service with authentication
    const compressResponse = await makeAuthenticatedRequest(COMPRESS_SERVICE_URL, {
      image_url: validatedData.imageUrl,
      quality: validatedData.quality,
    });

    // Check if the compress service was successful
    if (!compressResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Image compression failed",
        },
        { status: 500 },
      );
    }

    // Deduct credits using Admin SDK
    await adminUpdateUserCredits(
      userId,
      userCredits.credits - CREDIT_REQUIREMENT,
    );

    // Return the response from the compress service
    return NextResponse.json({
      success: true,
      message: compressResponse.message,
      image_url: compressResponse.image_url,
      original_size: compressResponse.original_size,
      compressed_size: compressResponse.compressed_size,
    });
  } catch (error) {
    console.error("Error compressing image:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
