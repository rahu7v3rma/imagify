import {
  adminGetFileDownloadURL,
  adminGetUserCredits,
  adminUpdateUserCredits,
  adminCreateUserCredits,
  adminUploadFile,
  admin,
} from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios";
import * as z from "zod";

const getCreditRequirement = (generateType: string) => {
  switch (generateType) {
    case "standard":
      return 2;
    case "pro":
      return 3;
    default:
      return 2;
  }
};

const requestSchema = z.object({
  imageUrl: z.string().max(1000, "Image URL must be at most 1000 characters"),
  generateType: z.string().min(1, "Generate type is required"),
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

    // Get credit requirement based on generate type
    const creditRequirement = getCreditRequirement(validatedData.generateType);

    // Check user credits using Admin SDK
    let userCredits = await adminGetUserCredits(userId);
    if (!userCredits) {
      // Create credits document with 0 initial credits if it doesn't exist
      await adminCreateUserCredits(userId, 0);
      userCredits = await adminGetUserCredits(userId);
    }
    
    if (!userCredits || userCredits.credits < creditRequirement) {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient credits",
        },
        { status: 400 },
      );
    }

    // Use Replicate to upscale image
    let input: any;
    let model: string;

    // Select model and input based on generate type
    switch (validatedData.generateType) {
      case "standard":
        model =
          "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa";
        input = {
          image: validatedData.imageUrl,
          scale: 2, // Fixed scale value
        };
        break;
      case "pro":
        model =
          "philz1337x/clarity-upscaler:dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e";
        input = {
          image: validatedData.imageUrl,
        };
        break;
      default:
        model =
          "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa";
        input = {
          image: validatedData.imageUrl,
          scale: 2,
        };
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(model as `${string}/${string}`, {
      input,
    });

    // Handle different output formats from Replicate
    let outputUrl: string;
    if (Array.isArray(output)) {
      // If output is an array, get the URL from the first element
      outputUrl = output[0].url();
    } else {
      // If output is a direct object, get its URL
      // @ts-expect-error - Replicate types are not up to date
      outputUrl = output.url() as string;
    }

    // Fetch the image from the Replicate output URL
    const imageResponse = await axios.get(outputUrl, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(imageResponse.data);

    // Upload the output image to Firebase Storage using Admin SDK
    const timestamp = Date.now();
    const fileName = `image-${timestamp}.png`;
    const filePath = `upscale/${fileName}`;

    await adminUploadFile(imageBuffer, filePath);
    const firebaseImageUrl = await adminGetFileDownloadURL(filePath);

    // Deduct credits using Admin SDK
    await adminUpdateUserCredits(
      userId,
      userCredits.credits - creditRequirement,
    );

    return NextResponse.json({
      success: true,
      message: "Image upscaled successfully",
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
