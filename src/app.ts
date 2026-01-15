import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import wordsRoutes from "./modules/word/word.routes";
import usersRoutes from "./modules/user/user.routes";
import errorMiddleware from "./middlewares/error";

dotenv.config();
connectDB();

const app = express();

// app.use(
//   cors({
//     origin: ["https://hasiif.vercel.app"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );
app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/api/words", wordsRoutes);
app.use("/api/users", usersRoutes);

app.use(errorMiddleware);

export default app;
