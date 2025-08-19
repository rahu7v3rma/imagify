import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateEmailVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const downloadImage = (
  imageHref: string,
  format = "png",
  filename = "generated-image"
) => {
  const link = document.createElement("a");
  link.href = imageHref;
  link.download = `${filename}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export async function convertImageUrlToBase64(
  imageUrl: string
): Promise<{ base64: string; fileSize: string; format: string }> {
  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });

  // Check if the response content type is an image
  const contentType = response.headers["content-type"];
  if (!contentType || !contentType.startsWith("image/")) {
    throw new Error(
      `Invalid content type: ${contentType}. Expected image content.`
    );
  }

  // Check file size (10MB limit) using content-length header
  const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
  const contentLength = response.headers["content-length"];
  if (!contentLength) {
    throw new Error(
      "Unable to determine file size. Content-Length header is missing."
    );
  }
  if (parseInt(contentLength) > maxSizeInBytes) {
    throw new Error("File size must be less than 10MB");
  }

  const imageBuffer = Buffer.from(response.data);
  const imageBase64 = imageBuffer.toString("base64");
  const fileSizeInMB =
    (parseInt(contentLength) / 1024 / 1024).toFixed(2) + " MB";

  const format = contentType.replace("image/", "");

  return {
    base64: `data:${contentType};base64,${imageBase64}`,
    fileSize: fileSizeInMB,
    format: format,
  };
}
