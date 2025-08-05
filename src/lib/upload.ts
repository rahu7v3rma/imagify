import fs from "fs/promises";
import path from "path";
import { UPLOAD_BASE_DIR, CONTACT_DIR } from "@/constants/lib/upload";
import type {
  UploadFileParams,
  UploadContactFileParams,
} from "@/types/lib/upload";

export const uploadFile = async ({ directory, file }: UploadFileParams) => {
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

export const uploadContactFile = async ({
  file,
  fileName,
}: UploadContactFileParams) => {
  return await uploadFile({ directory: CONTACT_DIR, file });
};
