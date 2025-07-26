import {
  getFileDownloadURL,
  getUserCredits,
  updateUserCredits,
  createUserCredits,
  uploadFile,
  admin,
} from "@/lib/firebase";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import tinify from "tinify";
import axios from "axios";

const CREDIT_REQUIREMENT = 3;

const requestSchema = z.object({
  imageUrl: z.string().max(1000, "Image URL must be at most 1000 characters"),
});

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

    // Check user credits using Admin SDK
    let userCredits = await getUserCredits(userId);
    if (!userCredits) {
      // Create credits document with 0 initial credits if it doesn't exist
      await createUserCredits(userId, 0);
      userCredits = await getUserCredits(userId);
    }
    
    if (!userCredits || userCredits.credits < CREDIT_REQUIREMENT) {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient credits",
        },
        { status: 400 },
      );
    }

    // Check if TINIFY_API_KEY is set
    if (!process.env.TINIFY_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "TinyPNG API key is not configured",
        },
        { status: 500 },
      );
    }

    // Set up TinyPNG API key
    tinify.key = process.env.TINIFY_API_KEY;

    // Fetch the image from the provided URL
    const imageResponse = await axios.get(validatedData.imageUrl, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(imageResponse.data);

    // Compress the image using TinyPNG
    const compressedBuffer = await tinify.fromBuffer(imageBuffer).toBuffer();

    // Upload the compressed image to Firebase Storage using Admin SDK
    const timestamp = Date.now();
    const fileName = `image-${timestamp}.png`;
    const filePath = `user_images/${userId}/compress-image/${fileName}`;

    await uploadFile(compressedBuffer, filePath);
    const firebaseImageUrl = await getFileDownloadURL(filePath);

    // Deduct credits using Admin SDK
    await updateUserCredits(
      userId,
      userCredits.credits - CREDIT_REQUIREMENT,
    );

    // Calculate file sizes
    const originalSize = imageBuffer.length;
    const compressedSize = compressedBuffer.length;

    return NextResponse.json({
      success: true,
      message: "Image compressed successfully",
      image_url: firebaseImageUrl,
      original_size: originalSize,
      compressed_size: compressedSize,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
