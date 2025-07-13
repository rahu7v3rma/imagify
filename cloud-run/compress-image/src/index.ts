import express, { Request, Response } from 'express';
import { z } from 'zod';
import axios from 'axios';
import sharp from 'sharp';
import {
  adminUploadFile,
  adminGetFileDownloadURL,
} from './firebase-admin';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Validation schema
const requestSchema = z.object({
  image_url: z.string().url('Please provide a valid image URL'),
  quality: z.number().min(10).max(100).default(80),
});

// POST route for compress image
app.post('/compress', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = requestSchema.parse(req.body);
    const { image_url, quality } = validatedData;

    // Download the image
    const imageResponse = await axios.get(image_url, {
      responseType: 'arraybuffer',
      timeout: 30000,
    });

    if (!imageResponse.data) {
      return res.status(400).json({
        success: false,
        message: 'Failed to download image',
      });
    }

    const originalBuffer = Buffer.from(imageResponse.data);
    const originalSize = originalBuffer.length;

    // Get the image format
    const image = sharp(originalBuffer);
    const metadata = await image.metadata();
    const format = metadata.format;

    // Compress the image using Sharp
    let compressedBuffer: Buffer;

    // Compress based on format
    if (format === 'jpeg' || format === 'jpg') {
      compressedBuffer = await image
        .jpeg({
          quality: quality,
          progressive: true
        })
        .toBuffer();
    } else if (format === 'png') {
      compressedBuffer = await image
        .png({
          quality: quality,
          compressionLevel: 9,
          progressive: true
        })
        .toBuffer();
    } else if (format === 'webp') {
      compressedBuffer = await image
        .webp({
          quality: quality
        })
        .toBuffer();
    } else {
      // Convert to JPEG for other formats
      compressedBuffer = await image
        .jpeg({
          quality: quality,
          progressive: true
        })
        .toBuffer();
    }

    const compressedSize = compressedBuffer.length;

    // Upload to Firebase Storage
    const timestamp = Date.now();
    const fileExtension = format === 'png' ? 'png' : format === 'webp' ? 'webp' : 'jpg';
    const fileName = `image-${timestamp}.${fileExtension}`;
    const filePath = `compressed/${fileName}`;

    await adminUploadFile(compressedBuffer, filePath, {
      originalSize: originalSize.toString(),
      compressedSize: compressedSize.toString(),
      compressionRatio: ((1 - compressedSize / originalSize) * 100).toFixed(2),
    });

    const firebaseImageUrl = await adminGetFileDownloadURL(filePath);

    // Return response
    return res.json({
      success: true,
      message: 'Image compressed successfully',
      image_url: firebaseImageUrl,
      original_size: originalSize,
      compressed_size: compressedSize,
    });

  } catch (error) {
    console.error('Error compressing image:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    if (axios.isAxiosError(error)) {
      return res.status(400).json({
        success: false,
        message: 'Failed to download image from provided URL',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 