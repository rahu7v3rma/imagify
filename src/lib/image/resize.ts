import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

export async function resizeImage(
  imageBase64: string,
  width: number,
  height: number,
): Promise<{ imageBase64: string }> {
  const tempDir = os.tmpdir();

  // Extract format from the data URI
  const formatMatch = imageBase64.match(/^data:image\/([a-z]+);base64,/);
  if (!formatMatch) {
    throw new Error('Invalid image format');
  }

  const format = formatMatch[1];
  const inputPath = path.join(tempDir, `resize-input-${Date.now()}.${format}`);
  const outputPath = path.join(
    tempDir,
    `resize-output-${Date.now()}.${format}`,
  );

  try {
    // Remove the data URI prefix and decode base64
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Write the image to a temporary file
    fs.writeFileSync(inputPath, imageBuffer);

    // Use ImageMagick to resize the image
    await execAsync(
      `convert "${inputPath}" -resize ${width}x${height} "${outputPath}"`,
    );

    // Read the resized image
    const resizedBuffer = fs.readFileSync(outputPath);
    const resizedBase64 = resizedBuffer.toString('base64');

    // Create the data URI with the original format
    const mimeType = `image/${format}`;
    const dataUri = `data:${mimeType};base64,${resizedBase64}`;

    return {
      imageBase64: dataUri,
    };
  } finally {
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
  }
}
