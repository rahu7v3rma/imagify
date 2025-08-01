import mongoose from "mongoose";
import { MONGOOSE_MODELS } from "../constants/mongoose";
import { userSchema } from "../utils/mongoose-schema";

export const User = mongoose.model(MONGOOSE_MODELS.USER, userSchema);
