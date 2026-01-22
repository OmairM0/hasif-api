import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import mongoose from "mongoose";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation";
import categoryModel from "./category.model";
import { makeSlug } from "../../utils/helpers";
import wordModel from "../word/word.model";
import { Category } from "./category.types";

export const getCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await categoryModel.find();

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  },
);

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid category id");
  }

  const category = await categoryModel.findById(id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
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
  },
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid category id");
    }

    const validatedData = updateCategorySchema.parse(req.body);
    if (Object.keys(validatedData).length === 0) {
      res.status(400);
      throw new Error("No data provided for update");
    }
    let updateData = { ...validatedData } as Partial<Category>;
    // check if word exist
    if (validatedData.name) {
      const slug = makeSlug(validatedData.name);
      const categoryExists = await categoryModel.findOne({
        _id: { $ne: id },
        $or: [{ name: validatedData.name }, { slug }],
      });

      if (categoryExists) {
        res.status(409);
        throw new Error("Category already exists");
      }

      updateData.slug = slug;
    }
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedCategory) {
      res.status(404);
      throw new Error("Category not found");
    }

    res.json({ success: true, data: updatedCategory });
  },
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid category id");
    }

    // check if category has words
    const hasWords = await wordModel.exists({ category: id });

    if (hasWords) {
      res.status(400);
      throw new Error(
        "This category cannot be deleted because it contains associated words",
      );
    }

    const deletedCategory = await categoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      res.status(404);
      throw new Error("Category not found");
    }

    res.status(200).json({ success: true });
  },
);
