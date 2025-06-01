import { MongoClient } from "mongodb";
import { MONGODB_URI, MONGODB_DB_NAME } from "../utils/env";

const getClient = async () => {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB_NAME);
  return { client, db };
};

export const getUsers = async ({ email }: { email: string }) => {
  const { client, db } = await getClient();
  const collection = db.collection("users");
  const doc = await collection.find({ email }).toArray();
  await client.close();
  return doc;
};

export const deleteUsers = async ({ email }: { email: string }) => {
  const { client, db } = await getClient();
  const collection = db.collection("users");
  await collection.deleteMany({ email });
  await client.close();
};

export const createUser = async ({
  email,
  password,
  registerEmailConfirmationCode,
  registerEmailConfirmed,
}: {
  email: string;
  password: string;
  registerEmailConfirmationCode?: string;
  registerEmailConfirmed: boolean;
}) => {
  const { client, db } = await getClient();
  const collection = db.collection("users");
  await collection.insertOne({
    email,
    password,
    registerEmailConfirmationCode,
    registerEmailConfirmed,
  });
  await client.close();
};

export const updateUser = async (
  { email }: { email: string },
  {
    registerEmailConfirmed,
  }: {
    registerEmailConfirmed: boolean;
  },
) => {
  const { client, db } = await getClient();
  const collection = db.collection("users");
  await collection.updateOne({ email }, { $set: { registerEmailConfirmed } });
  await client.close();
};
