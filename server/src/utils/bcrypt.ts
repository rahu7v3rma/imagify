import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../configs/bcrypt";

export const hashPassword = async ({ password }: { password: string }) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async ({
  password,
  hash,
}: {
  password: string;
  hash: string;
}) => {
  return await bcrypt.compare(password, hash);
};
