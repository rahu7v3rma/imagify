import {
  adminGetFileDownloadURL,
  adminGetUserCents,
  adminUpdateUserCents,
  adminUploadFile,
  admin,
} from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios";
import * as z from "zod";

const CENT_REQUIREMENT = 1;

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
        { status: 401 }
      );
    }

    const idToken = authHeader.split("Bearer ")[1];
    let userId: string;

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      userId = decodedToken.uid;
    } catch (error) {
      console.error("Error verifying ID token:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body with Zod schema
    const validatedData = requestSchema.parse(body);

    // Check user cents using Admin SDK
    const userCents = await adminGetUserCents(userId);
    if (!userCents || userCents.cents < CENT_REQUIREMENT) {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient cents",
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

    // Deduct cents using Admin SDK
    await adminUpdateUserCents(userId, userCents.cents - CENT_REQUIREMENT);

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
