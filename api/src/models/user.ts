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
  emailConfirmationCode: {
    type: String,
    required: false,
  },
  emailConfirmed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
