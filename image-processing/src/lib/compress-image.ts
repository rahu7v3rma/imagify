import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import { formatFileSize, parseDataUri } from "../utils/image";

const execAsync = promisify(exec);

export interface CompressionResult {
  dataUri: string;
  compressedSize: string;
  originalSize: string;
}

export async function compressPNG(
  base64Data: string,
  quality: number
): Promise<CompressionResult> {
  const tempDir = "/tmp";
  const inputFileName = `input_${Date.now()}.png`;
  const outputFileName = `output_${Date.now()}.png`;
  const inputPath = path.join(tempDir, inputFileName);
  const outputPath = path.join(tempDir, outputFileName);

  try {
    // Convert base64 to buffer and write to temp file
    const imageBuffer = Buffer.from(base64Data, "base64");
    await fs.writeFile(inputPath, imageBuffer);

    // Get original file size
    const originalStats = await fs.stat(inputPath);
    const originalSize = formatFileSize(originalStats.size);

    // Use OptipNG for PNG compression with quality control
    // For PNG, higher quality = lower compression level (0=no compression/best quality, 7=max compression/lower quality)
    const compressionLevel = Math.floor(((100 - quality) / 100) * 7);
    const optipngCommand = `optipng -o${compressionLevel} -strip all -out "${outputPath}" "${inputPath}"`;
    await execAsync(optipngCommand);

    // Read compressed image and get file stats
    const compressedBuffer = await fs.readFile(outputPath);
    const compressedStats = await fs.stat(outputPath);
    const compressedSize = formatFileSize(compressedStats.size);

    const compressedBase64 = compressedBuffer.toString("base64");
    const dataUri = `data:image/png;base64,${compressedBase64}`;

    return {
      dataUri,
      compressedSize,
      originalSize,
    };
  } finally {
    // Clean up temporary files
    await Promise.all([
      fs.unlink(inputPath).catch(() => {}),
      fs.unlink(outputPath).catch(() => {}),
    ]);
  }
}

export async function compressJPEG(
  base64Data: string,
  quality: number
): Promise<CompressionResult> {
  const tempDir = "/tmp";
  const inputFileName = `input_${Date.now()}.jpg`;
  const inputPath = path.join(tempDir, inputFileName);

  try {
    // Convert base64 to buffer and write to temp file
    const imageBuffer = Buffer.from(base64Data, "base64");
    await fs.writeFile(inputPath, imageBuffer);

    // Get original file size
    const originalStats = await fs.stat(inputPath);
    const originalSize = formatFileSize(originalStats.size);

    // Use jpegoptim for JPEG compression with quality control
    // Higher quality value = better quality output (jpegoptim --max= parameter)
    const jpegoptimCommand = `jpegoptim --max=${quality} --strip-all --overwrite "${inputPath}"`;
    await execAsync(jpegoptimCommand);

    // Read compressed image and get file stats
    const compressedBuffer = await fs.readFile(inputPath);
    const compressedStats = await fs.stat(inputPath);
    const compressedSize = formatFileSize(compressedStats.size);

    const compressedBase64 = compressedBuffer.toString("base64");
    const dataUri = `data:image/jpeg;base64,${compressedBase64}`;

    return {
      dataUri,
      compressedSize,
      originalSize,
    };
  } finally {
    // Clean up temporary file
    await fs.unlink(inputPath).catch(() => {});
  }
}

export async function compressWebP(
  base64Data: string,
  quality: number
): Promise<CompressionResult> {
  const tempDir = "/tmp";
  const inputFileName = `input_${Date.now()}.webp`;
  const outputFileName = `output_${Date.now()}.webp`;
  const inputPath = path.join(tempDir, inputFileName);
  const outputPath = path.join(tempDir, outputFileName);

  try {
    // Convert base64 to buffer and write to temp file
    const imageBuffer = Buffer.from(base64Data, "base64");
    await fs.writeFile(inputPath, imageBuffer);

    // Get original file size
    const originalStats = await fs.stat(inputPath);
    const originalSize = formatFileSize(originalStats.size);

    // Use cwebp for WebP compression with quality control
    // Higher quality value = better quality output (cwebp -q parameter)
    const cwebpCommand = `cwebp -q ${quality} "${inputPath}" -o "${outputPath}"`;
    await execAsync(cwebpCommand);

    // Read compressed image and get file stats
    const compressedBuffer = await fs.readFile(outputPath);
    const compressedStats = await fs.stat(outputPath);
    const compressedSize = formatFileSize(compressedStats.size);

    const compressedBase64 = compressedBuffer.toString("base64");
    const dataUri = `data:image/webp;base64,${compressedBase64}`;

    return {
      dataUri,
      compressedSize,
      originalSize,
    };
  } finally {
    // Clean up temporary files
    await Promise.all([
      fs.unlink(inputPath).catch(() => {}),
      fs.unlink(outputPath).catch(() => {}),
    ]);
  }
}

export async function compressImage(
  dataUri: string,
  quality: number
): Promise<CompressionResult> {
  const { format, base64Data } = parseDataUri(dataUri);

  switch (format) {
    case "png":
      return compressPNG(base64Data, quality);
    case "jpeg":
    case "jpg":
      return compressJPEG(base64Data, quality);
    case "webp":
      return compressWebP(base64Data, quality);
    default:
      throw new Error(`Unsupported image format: ${format}`);
  }
}