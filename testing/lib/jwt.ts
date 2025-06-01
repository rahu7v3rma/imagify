import jwt from "jsonwebtoken";

export const generateJWT = ({ userId }: { userId: string }) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET);
};

export const verifyJWT = ({ token }: { token: string }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
