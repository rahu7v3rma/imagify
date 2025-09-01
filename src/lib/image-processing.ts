import axios from 'axios';

const baseUrl = process.env.IMAGE_PROCESSING_API_ENDPOINT;

const request = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: process.env.IMAGE_PROCESSING_API_TOKEN,
  },
});

export const compressImage = async (
  imageBase64: string,
  quality: number,
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
  const endpoint = '/compress-image';
  const response = await request.post(endpoint, {
    imageBase64,
    quality,
  });

  return response.data;
};

export const extractText = async (
  imageBase64: string,
): Promise<{
  success: boolean;
  message: string;
  data: {
    extractedText: string;
  };
}> => {
  const endpoint = '/extract-text';
  const response = await request.post(endpoint, {
    imageBase64,
  });

  return response.data;
};

export const convertFormat = async (
  imageBase64: string,
  format: string,
): Promise<{
  success: boolean;
  message: string;
  data: {
    imageBase64: string;
  };
}> => {
  const endpoint = '/convert-format';
  const response = await request.post(endpoint, {
    imageBase64,
    format,
  });

  return response.data;
};

export const resizeImage = async (
  imageBase64: string,
  width: number,
  height: number,
): Promise<{
  success: boolean;
  message: string;
  data: {
    imageBase64: string;
  };
}> => {
  const endpoint = '/resize';
  const response = await request.post(endpoint, {
    imageBase64,
    width,
    height,
  });

  return response.data;
};
