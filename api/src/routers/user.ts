import { Router } from "express";
import { validateRequestBody } from "../middlewares/validation";
import { UserRegisterRequestBody } from "../lib/schema";
import { hashPassword } from "../lib/bcrypt";
import UserModel from "../models/user";
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

    res.json({
      success: true,
      message: "user registered",
      data: null,
    });
  }
);

export default router;
