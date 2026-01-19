import mongoose, { Schema, Document } from "mongoose";
import { Category } from "./category.types";
import slugify from "slugify";

export interface CategoryDocument extends Category, Document {}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: String,
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
  }
);

export default mongoose.model<CategoryDocument>("Category", categorySchema);
