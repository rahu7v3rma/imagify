import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateEmailVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const downloadImage = (imageHref: string) => {
  const link = document.createElement("a");
  link.href = imageHref;
  link.download = "generated-image.png";
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

export async function convertImageUrlToBase64(imageUrl: string): Promise<string> {
  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });
  
  // Check if the response content type is an image
  const contentType = response.headers['content-type'];
  if (!contentType || !contentType.startsWith('image/')) {
    throw new Error(`Invalid content type: ${contentType}. Expected image content.`);
  }
  
  const imageBuffer = Buffer.from(response.data);
  const imageBase64 = imageBuffer.toString("base64");
  
  return `data:${contentType};base64,${imageBase64}`;
}
