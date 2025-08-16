import tinify from "tinify";

// Initialize tinify with API key
tinify.key = process.env.TINIFY_API_KEY!;

export async function compressBase64Image(
  base64String: string
): Promise<string> {
  // Remove the data:image/*;base64, prefix if present
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

  // Create buffer from base64 string
  const buffer = Buffer.from(base64Data, "base64");

  // Compress the image using tinify
  const source = tinify.fromBuffer(buffer);

  // Convert result buffer back to base64 using callback
  const resultBuffer = await new Promise<Buffer>((resolve, reject) => {
    source.toBuffer((err, data) => {
      if (err) reject(err);
      else if (data) resolve(Buffer.from(data));
      else reject(new Error("No data returned from tinify"));
    });
  });

  // Convert result buffer back to base64
  const resultBase64 = resultBuffer.toString("base64");

  // Add the data:image/*;base64, prefix back
  // We'll need to determine the image type, but for now we'll assume it's the same as input
  const mimeTypeMatch = base64String.match(/^data:(image\/\w+);base64,/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/png";

  return `data:${mimeType};base64,${resultBase64}`;
}

export async function convertFormatBase64Image(
  base64String: string,
  format: string
): Promise<string> {
  // Remove the data:image/*;base64, prefix if present
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

  // Create buffer from base64 string
  const buffer = Buffer.from(base64Data, "base64");

  // Convert format using tinify
  const source = tinify.fromBuffer(buffer);

  // Map format to MIME type
  const formatMap: Record<string, any> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
  };

  const mimeType = formatMap[format.toLowerCase()] || "image/png";

  // Convert to specified format
  const converted = source.convert({ type: [mimeType] });

  // Convert result buffer back to base64 using callback
  const resultBuffer = await new Promise<Buffer>((resolve, reject) => {
    converted.toBuffer((err, data) => {
      if (err) reject(err);
      else if (data) resolve(Buffer.from(data));
      else reject(new Error("No data returned from tinify"));
    });
  });

  // Convert result buffer back to base64
  const resultBase64 = resultBuffer.toString("base64");

  return `data:${mimeType};base64,${resultBase64}`;
}
