import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accessToken: { type: String, required: false },
  emailVerificationCode: { type: String, required: false },
  emailVerified: { type: Boolean, required: false, default: false },
});
