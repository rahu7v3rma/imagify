import axios from "axios";

const baseUrl = process.env.IMAGE_PROCESSING_API_ENDPOINT;

const request = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: process.env.IMAGE_PROCESSING_API_TOKEN,
  },
});

export const compressImage = async (
  imageBase64: string,
  quality: number
): Promise<{
  success: boolean;
  message: string;
  data: {
    imageBase64: string;
    compressedSize: string;
    originalSize: string;
    format: string;
  };
}> => {
  const endpoint = "/compress-image";
  const response = await request.post(
    endpoint,
    {
      imageBase64,
      quality,
    },
    {
      headers: {
        Authorization: process.env.IMAGE_PROCESSING_API_TOKEN,
      },
    }
  );

  return response.data;
};
