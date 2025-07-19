import {
  adminGetFileDownloadURL,
  adminGetUserCredits,
  adminUpdateUserCredits,
  adminUploadFile,
  admin,
} from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import tinify from "tinify";
import axios from "axios";

const CREDIT_REQUIREMENT = 3;

const requestSchema = z.object({
  imageUrl: z.string().max(1000, "Image URL must be at most 1000 characters"),
  outputFormat: z.enum(["png", "jpeg", "jpg", "webp"], {
    required_error: "Output format is required",
  }),
});

const isValidImageFormat = (mimeType: string): boolean => {
  const supportedFormats = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  return supportedFormats.includes(mimeType);
};

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

    // Check if the image format is supported
    const contentType = imageResponse.headers["content-type"];
    if (!contentType || !isValidImageFormat(contentType)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unsupported image format. Only JPEG, JPG, PNG, and WebP are supported.",
        },
        { status: 400 },
      );
    }

    const imageBuffer = Buffer.from(imageResponse.data);

    // Convert the image format using TinyPNG
    const source = tinify.fromBuffer(imageBuffer);

    // Map output format to TinyPNG format
    let convertType: "image/png" | "image/jpeg" | "image/webp";
    switch (validatedData.outputFormat) {
      case "png":
        convertType = "image/png";
        break;
      case "jpeg":
      case "jpg":
        convertType = "image/jpeg";
        break;
      case "webp":
        convertType = "image/webp";
        break;
      default:
        convertType = "image/png";
    }

    // Convert the image
    let convertedBuffer;
    try {
      const converted = source.convert({ type: convertType });
      convertedBuffer = await converted.toBuffer();
    } catch (error: any) {
      // Handle flattening error
      if (
        error.message &&
        error.message.includes("Image requires flattening")
      ) {
        // Retry with black background
        const transformedSource = source.transform({ background: "black" });
        const converted = transformedSource.convert({ type: convertType });
        convertedBuffer = await converted.toBuffer();
      } else {
        throw error;
      }
    }

    // Upload the converted image to Firebase Storage using Admin SDK
    const timestamp = Date.now();
    const fileName = `image-${timestamp}.${validatedData.outputFormat}`;
    const filePath = `user_images/${userId}/convert-format/${fileName}`;

    await adminUploadFile(convertedBuffer, filePath);
    const firebaseImageUrl = await adminGetFileDownloadURL(filePath);

    // Deduct credits using Admin SDK
    await adminUpdateUserCredits(
      userId,
      userCredits.credits - CREDIT_REQUIREMENT,
    );

    return NextResponse.json({
      success: true,
      message: "Image format converted successfully",
      image_url: firebaseImageUrl,
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
