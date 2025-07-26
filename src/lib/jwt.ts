import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateJWT = (userId: string): string => {
  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const validateJWT = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };
    return { userId: decoded.userId };
  } catch (error) {
    return null;
  }
};
