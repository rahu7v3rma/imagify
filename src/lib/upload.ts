import fs from "fs/promises";
import path from "path";

export const UPLOAD_BASE_DIR = path.join(process.cwd(), "uploads");
export const CONTACT_DIR = "contact";

export const uploadFile = async ({
  directory,
  file,
}: {
  file: File;
  directory: string;
}) => {
  try {
    const fileName = `file-${Date.now()}.${file.name.split(".").pop()}`;

    const fullPath = path.join(UPLOAD_BASE_DIR, directory, fileName);
    const fullDirectory = path.dirname(fullPath);

    await fs.mkdir(fullDirectory, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(fullPath, buffer);

    return path.join(directory, fileName);
  } catch (error) {
    return null;
  }
};

export const uploadContactFile = async ({ file }: { file: File }) => {
  return await uploadFile({ directory: CONTACT_DIR, file });
};