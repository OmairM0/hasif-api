import mongoose, { Schema } from "mongoose";
import { User } from "./user.types";

export interface UserDocument extends User, Document {}

const UserSchama = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      minlength: 3,
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret: any) => {
        const transformed = {
          id: ret._id,
          ...ret,
        };

        delete transformed._id;
        delete transformed.__v;

        return transformed;
      },
    },
    toObject: {
      transform: (doc, ret: any) => {
        const transformed = {
          id: ret._id,
          ...ret,
        };

        delete transformed._id;
        delete transformed.__v;

        return transformed;
      },
    },
  },
);

export default mongoose.model<UserDocument>("User", UserSchama);
