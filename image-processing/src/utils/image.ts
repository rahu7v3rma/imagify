export const parseDataUri = (dataUri: string) => {
  const match = dataUri.match(/^data:image\/(.+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid data URI format");
  }

  const [, format, base64Data] = match;
  // Normalize format (jpg -> jpeg)
  const normalizedFormat = format === "jpg" ? "jpeg" : format;

  return {
    format: normalizedFormat,
    base64Data,
    extension: normalizedFormat,
  };
};

export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes.toFixed(2)} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  }
};

