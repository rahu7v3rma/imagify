import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const execAsync = promisify(exec);

export async function convertFormat(
  imageBase64: string,
  targetFormat: string
): Promise<{ imageBase64: string }> {
  const tempDir = os.tmpdir();
  const inputPath = path.join(tempDir, `convert-input-${Date.now()}.png`);
  const outputPath = path.join(
    tempDir,
    `convert-output-${Date.now()}.${targetFormat}`
  );

  try {
    // Remove the data URI prefix and decode base64
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Write the image to a temporary file
    fs.writeFileSync(inputPath, imageBuffer);

    // Use ImageMagick to convert the format
    await execAsync(`convert "${inputPath}" "${outputPath}"`);

    // Read the converted image
    const convertedBuffer = fs.readFileSync(outputPath);
    const convertedBase64 = convertedBuffer.toString("base64");

    // Create the data URI with the correct MIME type
    const mimeType = `image/${targetFormat}`;
    const dataUri = `data:${mimeType};base64,${convertedBase64}`;

    return {
      imageBase64: dataUri,
    };
  } finally {
    // Clean up temporary files
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
  }
}
