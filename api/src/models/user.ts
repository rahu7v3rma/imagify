import mongoose, { Schema } from "mongoose";

export interface User extends Document {
  email: string;
  password: string;
  registerEmailConfirmationCode: string;
  registerEmailConfirmed: boolean;
  forgotPasswordEmailConfirmationCode: string;
}

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  registerEmailConfirmationCode: {
    type: String,
    required: false,
  },
  registerEmailConfirmed: {
    type: Boolean,
    required: true,
    default: false,
  },
  forgotPasswordEmailConfirmationCode: {
    type: String,
    required: false,
  },
});

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
