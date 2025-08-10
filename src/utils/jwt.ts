import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function encodeJWT({
  payload,
  options,
}: {
  payload: object;
  options?: object;
}) {
  return jwt.sign(payload, JWT_SECRET, options);
}

export function decodeJWT({ token }: { token: string }) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function generateAccessToken({ userId }: { userId: string }) {
  return encodeJWT({ payload: { userId }, options: { expiresIn: "7d" } });
}

export function decodeAccessToken({ token }: { token: string }) {
  return decodeJWT({ token });
}
