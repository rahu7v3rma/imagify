import { Router } from "express";
import { validateRequestBody } from "../middlewares/validation";
import {
  UserRegisterRequestBody,
  UserEmailConfirmRequestBody,
  UserLoginRequestBody,
} from "../lib/schema";
import { hashPassword, comparePassword } from "../lib/bcrypt";
import UserModel from "../models/user";
import { generateJWT } from "../lib/jwt";
import { generateEmailConfirmationCode } from "../utils/general";
import { sendRegistrationEmail } from "../lib/email";

const router = Router();

router.post(
  "/register",
  validateRequestBody(UserRegisterRequestBody),
  async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "email already exists",
        data: null,
      });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const emailConfirmationCode = generateEmailConfirmationCode();

    const user = new UserModel({
      email,
      password: hashedPassword,
      emailConfirmationCode,
      emailConfirmed: false,
    });

    await user.save();

    await sendRegistrationEmail({ to: email, emailConfirmationCode });

    res.status(200).json({
      success: true,
      message: "user registered",
      data: null,
    });
  },
);

router.post(
  "/email/confirm",
  validateRequestBody(UserEmailConfirmRequestBody),
  async (req, res) => {
    const { email, emailConfirmationCode } = req.body;
    const user = await UserModel.findOne({ email, emailConfirmationCode });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "user not found",
        data: null,
      });
      return;
    }
    user.emailConfirmed = true;
    await user.save();
    res.status(200).json({
      success: true,
      message: "email confirmed successfully",
      data: null,
    });
  },
);
router.post(
  "/login",
  validateRequestBody(UserLoginRequestBody),
  async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res
        .status(400)
        .json({ success: false, message: "invalid credentials", data: null });
      return;
    }
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      res
        .status(400)
        .json({ success: false, message: "invalid credentials", data: null });
      return;
    }
    const token = generateJWT({ userId: user._id.toString() });
    res
      .status(200)
      .json({ success: true, message: "login successful", data: { token } });
  },
);
export default router;
