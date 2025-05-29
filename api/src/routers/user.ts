import { Router } from "express";
import { validateRequestBody } from "../middlewares/validation";
import { UserRegisterRequestBody } from "../lib/schema";

const router = Router();

router.post(
  "/register",
  validateRequestBody(UserRegisterRequestBody),
  (req, res) => {
    const { email, password } = req.body;
    res.json({
      success: true,
      message: "user registered",
      data: null
    });
  }
);

export default router;
