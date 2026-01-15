import mongoose, { Schema } from "mongoose";
import { User } from "./user.types";

export interface UserDocument extends User, Document {}

const UserSchama = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model<UserDocument>("User", UserSchama);
