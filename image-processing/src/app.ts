import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { env } from "./utils/env";
import compressImageRouter from "./routers/compress-image";
import extractTextRouter from "./routers/extract-text";
import convertFormatRouter from "./routers/convert-format";
import resizeRouter from "./routers/resize";

const app = express();

const limiter = rateLimit({
  windowMs: 1000,
  max: 10,
});

app.use(morgan("tiny"));
app.use(cors({
  origin: env.CORS_ORIGIN,
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));

app.use('/compress-image', compressImageRouter);
app.use('/extract-text', extractTextRouter);
app.use('/convert-format', convertFormatRouter);
app.use('/resize', resizeRouter);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
