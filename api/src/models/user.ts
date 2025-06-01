import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
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

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
