import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import wordsRoutes from "./modules/words/words.routes";
import errorMiddleware from "./middlewares/error.middleware";

dotenv.config();
connectDB();

const app = express();

// app.use(
//   cors({
//     origin: ["https://hasiif.vercel.app"], // دومين الويب حقك
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );
app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/api/words", wordsRoutes);

app.use(errorMiddleware);

export default app;
