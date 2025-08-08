import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = async ({ password }: { password: string }) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async ({
  password,
  hashedPassword,
}: {
  password: string;
  hashedPassword: string;
}) => {
  return await bcrypt.compare(password, hashedPassword);
};
