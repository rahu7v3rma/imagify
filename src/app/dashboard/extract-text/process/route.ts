import {
  getUserCredits,
  updateUserCredits,
  createUserCredits,
  admin,
} from "@/lib/firebase";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import * as z from "zod";

const CREDIT_REQUIREMENT = 2;

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

    // Use Replicate to extract text
    const input = {
      image: validatedData.imageUrl,
    };

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
      "abiruyt/text-extract-ocr:a524caeaa23495bc9edc805ab08ab5fe943afd3febed884a4f3747aa32e9cd61",
      { input },
    );

    // The output is already a string for this OCR model
    // @ts-expect-error - output is a string for this OCR model
    const extractedText = output as string;

    // Deduct credits using Admin SDK
    await updateUserCredits(
      userId,
      userCredits.credits - CREDIT_REQUIREMENT,
    );

    return NextResponse.json({
      success: true,
      message: "Text extracted successfully",
      extracted_text: extractedText,
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
