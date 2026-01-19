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
  { timestamps: true }
);

categorySchema.pre("save", async function () {
  if (!this.isModified("name")) return;

  let baseSlug = slugify(this.name, {
    lower: true,
    strict: true,
    locale: "ar",
  });
  let slug = baseSlug;
  let count = 1;

  const Category = this.constructor as any;

  while (await Category.exists({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
});

export default mongoose.model<CategoryDocument>("Category", categorySchema);
