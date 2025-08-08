import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function encodeJWT({ payload }: { payload: object }) {
  return jwt.sign(payload, JWT_SECRET);
}

export function decodeJWT({ token }: { token: string }) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function generateAccessToken({ userId }: { userId: string }) {
  return encodeJWT({ payload: { userId } });
}

export function decodeAccessToken({ token }: { token: string }) {
  return decodeJWT({ token });
}
