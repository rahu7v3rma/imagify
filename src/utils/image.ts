export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes.toFixed(2)} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  }
};

export const parseDataUri = (dataUri: string) => {
  const match = dataUri.match(/^data:image\/(.+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid data URI format');
  }

  const [, format, base64Data] = match;

  return {
    format,
    base64Data,
    extension: format,
  };
};

export const extractImageDimensions = (base64: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve(`${img.width} × ${img.height}`);
    };
    img.onerror = () => {
      resolve('Unknown dimensions');
    };
    img.src = base64;
  });
};
