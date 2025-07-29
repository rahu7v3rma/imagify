// import {
//   getFileDownloadURL,
//   getUserCredits,
//   updateUserCredits,
//   createUserCredits,
//   uploadFile,
//   admin,
// } from "@/lib/firebase";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios";
import * as z from "zod";

const getCreditRequirement = (generateType: string) => {
  switch (generateType) {
    case "standard":
      return 2;
    case "pro":
      return 6;
    case "max":
      return 10;
    default:
      return 2;
  }
};

const requestSchema = z.object({
  imageUrl: z.string().max(1000, "Image URL must be at most 1000 characters"),
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .max(500, "Prompt must be at most 500 characters"),
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
      // const decodedToken = await admin.auth().verifyIdToken(idToken);
      // userId = decodedToken.uid;
      // Temporary fallback for testing
      userId = "temp-user-id";
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
    // let userCredits = await getUserCredits(userId);
    // if (!userCredits) {
    //   // Create credits document with 0 initial credits if it doesn't exist
    //   await createUserCredits(userId, 0);
    //   userCredits = await getUserCredits(userId);
    // }
    // Temporary fallback for testing
    let userCredits = { credits: 100 };
    
    if (!userCredits || userCredits.credits < creditRequirement) {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient credits",
        },
        { status: 400 },
      );
    }

    // Use Replicate to edit image
    let input: any;
    let model: string;

    // Select model and input based on generate type
    switch (validatedData.generateType) {
      case "standard":
        model = "openai/gpt-image-1";
        input = {
          prompt: validatedData.prompt,
          input_images: [validatedData.imageUrl],
          openai_api_key: process.env.OPENAI_API_KEY,
        };
        break;
      case "pro":
        model = "black-forest-labs/flux-kontext-pro";
        input = {
          prompt: validatedData.prompt,
          image: validatedData.imageUrl,
        };
        break;
      case "max":
        model = "black-forest-labs/flux-kontext-max";
        input = {
          prompt: validatedData.prompt,
          image: validatedData.imageUrl,
        };
        break;
      default:
        model = "openai/gpt-image-1";
        input = {
          prompt: validatedData.prompt,
          input_images: [validatedData.imageUrl],
          openai_api_key: process.env.OPENAI_API_KEY,
        };
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(model as `${string}/${string}`, {
      input,
    });

    // The output is an array, get the first element (URL)
    // @ts-expect-error - Replicate types are not up to date
    const outputUrl = Array.isArray(output) ? output[0].url() : output.url();

    if (!outputUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "No output image generated",
        },
        { status: 500 },
      );
    }

    // Fetch the image from the Replicate output URL
    const imageResponse = await axios.get(outputUrl, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(imageResponse.data);

    // Upload the output image to Firebase Storage using Admin SDK
    const timestamp = Date.now();
    const fileName = `image-${timestamp}.png`;
    const filePath = `edit/${fileName}`;

    // await uploadFile(imageBuffer, filePath);
    // const firebaseImageUrl = await getFileDownloadURL(filePath);
    // Temporary fallback for testing
    const firebaseImageUrl = outputUrl;

    // Deduct credits using Admin SDK
    // await updateUserCredits(
    //   userId,
    //   userCredits.credits - creditRequirement,
    // );
    // Temporary fallback for testing - credits not deducted

    return NextResponse.json({
      success: true,
      message: "Image edited successfully",
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
