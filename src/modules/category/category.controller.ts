import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import mongoose from "mongoose";
import { createCategorySchema } from "./category.validation";
import categoryModel from "./category.model";
import { makeSlug } from "../../utils/helpers";

export const getCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await categoryModel.find();

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  }
);

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid category id" });
    return;
  }

  const category = await categoryModel.findById(id);

  if (!category) {
    res.status(404).json({ message: "Category not found" });
    return;
  }

  res.json({
    success: true,
    data: category,
  });
});

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = createCategorySchema.parse(req.body);
    const slug = makeSlug(validatedData.name);
    // check if word exist
    const categoryExists = await categoryModel.findOne({
      $or: [{ name: validatedData.name }, { slug }],
    });
    if (categoryExists) {
      res.status(409);
      throw new Error("Category already exists");
    }

    const createdCategory = await categoryModel.create({
      ...validatedData,
      slug,
    });

    res.json({ success: true, data: createdCategory });
  }
);
