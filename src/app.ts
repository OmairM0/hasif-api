import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/user/user.routes";
import wordsRoutes from "./modules/word/word.routes";
import categoriesRoutes from "./modules/category/category.routes";
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

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/words", wordsRoutes);
app.use("/api/categories", categoriesRoutes);

app.use(errorMiddleware);

export default app;
