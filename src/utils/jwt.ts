import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const SHARE_IMAGE_JWT_SECRET = process.env.SHARE_IMAGE_JWT_SECRET!;

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
  return jwt.verify(token, JWT_SECRET);
}

export function generateAccessToken({ userId }: { userId: string }) {
  return encodeJWT({ payload: { userId }, options: { expiresIn: '7d' } });
}

export function decodeAccessToken({ token }: { token: string }) {
  return decodeJWT({ token });
}

export function generateShareId({
  userId,
  fileId,
}: {
  userId: number;
  fileId: number;
}) {
  return jwt.sign({ userId, fileId }, SHARE_IMAGE_JWT_SECRET);
}

export function decodeShareId({ token }: { token: string }) {
  return jwt.verify(token, SHARE_IMAGE_JWT_SECRET) as {
    userId: number;
    fileId: number;
  };
}
