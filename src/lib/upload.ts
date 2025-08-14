import { Client, Storage, ID } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_STORAGE_API_SECRET!);

const storage = new Storage(client);

export const uploadFile = async ({ file }: { file: File }) => {
  const response = await storage.createFile(
    process.env.APPWRITE_STORAGE_BUCKET_ID!,
    ID.unique(),
    file
  );

  return response.$id;
};
