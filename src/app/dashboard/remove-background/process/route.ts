import {
  adminGetFileDownloadURL,
  adminGetUserCredits,
  adminUpdateUserCredits,
  adminUploadFile,
} from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios";
import * as z from "zod";

const CREDIT_REQUIREMENT = 1;

const requestSchema = z.object({
  imageUrl: z.string().max(1000, "Image URL must be at most 1000 characters"),
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

    // Check user credits using Admin SDK
    const userCredits = await adminGetUserCredits(userId);
    if (!userCredits || userCredits.credits < CREDIT_REQUIREMENT) {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient credits",
        },
        { status: 400 }
      );
    }

    // Use Replicate to remove background
    const input = {
      image: validatedData.imageUrl,
    };

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
      "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1",
      { input }
    );
    // @ts-expect-error - Replicate types are not up to date
    const outputUrl = output.url();

    // Fetch the image from the Replicate output URL
    const imageResponse = await axios.get(outputUrl, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(imageResponse.data);

    // Upload the output image to Firebase Storage using Admin SDK
    const timestamp = Date.now();
    const fileName = `image-${timestamp}.png`;
    const filePath = `user_images/${userId}/remove-background/${fileName}`;

    await adminUploadFile(imageBuffer, filePath);
    const firebaseImageUrl = await adminGetFileDownloadURL(filePath);

    // Deduct credits using Admin SDK
    await adminUpdateUserCredits(userId, userCredits.credits - CREDIT_REQUIREMENT);

    return NextResponse.json({
      success: true,
      message: "Background removed successfully",
      image_url: firebaseImageUrl,
    });
  } catch (error) {
    console.error("Error removing background:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
