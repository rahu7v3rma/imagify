import fs from 'fs';
import os from 'os';
import path from 'path';

export const convertImageToBase64 = async (
  file: File,
  format: string,
): Promise<string> => {
  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Check if format is supported
  const supportedFormats = ['png', 'jpg', 'jpeg', 'webp'];
  if (!supportedFormats.includes(format.toLowerCase())) {
    throw new Error('Format must be one of: png, jpg, jpeg, webp');
  }

  // Generate a unique temporary file name
  const tempFileName = `${file.name}-${Date.now()}.${format.toLowerCase()}`;
  const tempFilePath = path.join(os.tmpdir(), tempFileName);

  try {
    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write buffer to temporary file
    fs.writeFileSync(tempFilePath, buffer);

    // Read file back as buffer
    const fileBuffer = fs.readFileSync(tempFilePath);

    // Convert buffer to base64
    const base64Data = fileBuffer.toString('base64');
    const dataUri = `data:image/${format.toLowerCase()};base64,${base64Data}`;

    return dataUri;
  } catch (error) {
    throw new Error(
      `Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  } finally {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
};
