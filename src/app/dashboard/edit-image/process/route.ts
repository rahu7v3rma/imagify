import {
  getFileDownloadURL,
  getUserCredits,
  updateUserCredits,
  uploadFile,
} from "@/lib/firebase";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios";
import * as z from "zod";

const CREDIT_REQUIREMENT = 1;

const requestSchema = z.object({
  imageUrl: z.string().max(1000, "Image URL must be at most 1000 characters"),
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .max(500, "Prompt must be at most 500 characters"),
});

export async function POST(request: NextRequest) {
  try {
    // Get user ID from authorization header
    const userId = request.headers.get("authorization");
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization header is required",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body with Zod schema
    const validatedData = requestSchema.parse(body);

    // Check user credits
    const userCredits = await getUserCredits(userId);
    if (!userCredits || userCredits.credits < CREDIT_REQUIREMENT) {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient credits",
        },
        { status: 400 }
      );
    }

    // Use Replicate to edit image
    const input = {
      prompt: validatedData.prompt,
      input_images: [validatedData.imageUrl],
      openai_api_key: process.env.OPENAI_API_KEY,
    };

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run("openai/gpt-image-1", { input });

    // The output is an array, get the first element (URL)
    // @ts-expect-error - Replicate types are not up to date
    const outputUrl = Array.isArray(output) ? output[0].url() : output.url();

    if (!outputUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "No output image generated",
        },
        { status: 500 }
      );
    }

    // Fetch the image from the Replicate output URL
    const imageResponse = await axios.get(outputUrl, {
      responseType: "arraybuffer",
    });
    const imageBuffer = imageResponse.data;

    // Upload the output image to Firebase Storage
    const timestamp = Date.now();
    const fileName = `image-${timestamp}.png`;
    const filePath = `user_images/${userId}/edit-image/${fileName}`;

    await uploadFile(new Uint8Array(imageBuffer), filePath);
    const firebaseImageUrl = await getFileDownloadURL(filePath);

    // Deduct credits
    await updateUserCredits(userId, userCredits.credits - CREDIT_REQUIREMENT);

    return NextResponse.json({
      success: true,
      message: "Image edited successfully",
      image_url: firebaseImageUrl,
    });
  } catch (error) {
    console.error("Error editing image:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
} 