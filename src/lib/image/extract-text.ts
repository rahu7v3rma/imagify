import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const execAsync = promisify(exec);

export async function extractText(
  imageBase64: string
): Promise<{ text: string }> {
  const tempDir = os.tmpdir();
  const tempImagePath = path.join(tempDir, `extract-text-${Date.now()}.png`);

  try {
    // Remove the data URI prefix and decode base64
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Write the image to a temporary file
    fs.writeFileSync(tempImagePath, imageBuffer);

    // Run tesseract CLI command
    const { stdout } = await execAsync(`tesseract "${tempImagePath}" stdout`);

    return {
      text: stdout.trim(),
    };
  } finally {
    fs.unlinkSync(tempImagePath);
  }
}
