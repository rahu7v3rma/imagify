import express from "express";

const userRouter = express.Router();

userRouter.post("/signup", (req, res) => {
  const { email, password, confirmPassword, agreeToTerms } = req.body;
});

export default userRouter;