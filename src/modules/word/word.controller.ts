import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { WordDTO } from "./word.types";
import mongoose from "mongoose";
import {
  approveWordSchema,
  createWordSchema,
  updateWordSchema,
} from "./word.validation";
import categoryModel from "../category/category.model";
import wordModel from "./word.model";
import { getPagination } from "../../utils/pagination";

export const getWords = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user?.role === "admin";
  const { page, limit } = req.query;

  const {
    skip,
    limit: pageLimit,
    page: currentPage,
  } = getPagination({
    page: Number(page),
    limit: Number(limit),
  });

  const filter = isAdmin ? {} : { isApproved: true };
  // const words = await wordModel.find(filter);
  const [words, total] = await Promise.all([
    wordModel.find(filter).skip(skip).limit(pageLimit),
    wordModel.countDocuments(),
  ]);

  const data: WordDTO[] = words.map((w) => ({
    id: w.id,
    word: w.word,
    diacritic: w.diacritic,
    meaning: w.meaning,
    explanation: w.explanation,
    example: w.example,
    category: w.category,
    isApproved: w.isApproved,
    // rarity: w.rarity,
  }));

  res.json({
    success: true,
    count: data.length,
    data,
    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      totalPages: Math.ceil(total / pageLimit),
      hasNext: skip + pageLimit < total,
      hasPrev: currentPage > 1,
    },
  });
});

export const getWord = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid word id");
  }

  const word = await wordModel.findById(id);

  if (!word) {
    res.status(404);
    throw new Error("Word not found");
  }

  res.json({ success: true, data: word });
});

export const getRandomWord = asyncHandler(
  async (_req: Request, res: Response) => {
    const count = await wordModel.countDocuments();
    const random = Math.floor(Math.random() * count);
    const word = await wordModel.findOne().skip(random);

    res.json({
      success: true,
      data: word,
    });
  },
);

export const createWord = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = createWordSchema.parse(req.body);

  // check if category exist
  const categoryExists = await categoryModel.exists({
    _id: validatedData.category,
  });
  if (!categoryExists) {
    res.status(400);
    throw new Error("Category does not exist");
  }

  // check if word exist
  const wordExists = await wordModel.findOne({ word: validatedData.word });
  if (wordExists) {
    res.status(409);
    throw new Error("Word already exists");
  }

  const createdWord = await wordModel.create({
    ...validatedData,
    createdBy: req.user?.id,
  });

  res.json({ success: true, data: createdWord });
});

export const deleteWord = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid word id");
  }

  const deletedWord = await wordModel.findByIdAndDelete(id);

  if (!deletedWord) {
    res.status(404);
    throw new Error("Word not found");
  }

  res.status(200).json({ success: true });
});

export const updateWord = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid word id");
  }

  const validatedData = updateWordSchema.parse(req.body);

  if (Object.keys(validatedData).length === 0) {
    res.status(400);
    throw new Error("No data provided for update");
  }

  // check if category exist
  if (validatedData.category) {
    const categoryExists = await categoryModel.exists({
      _id: validatedData.category,
    });
    if (!categoryExists) {
      res.status(400);
      throw new Error("Category does not exist");
    }
  }

  // check if word already exists (exclude current word)
  if (validatedData.word) {
    const wordExists = await wordModel.findOne({
      word: validatedData.word,
      _id: { $ne: id },
    });
    if (wordExists) {
      res.status(409);
      throw new Error("Word already exists");
    }
  }

  const updatedWord = await wordModel.findByIdAndUpdate(
    id,
    { ...validatedData, isApproved: false },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedWord) {
    res.status(404);
    throw new Error("Word not found");
  }

  res.json({ success: true, data: updatedWord });
});

export const approveWord = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid word id");
  }

  const validatedData = approveWordSchema.parse(req.body);

  const approvedWord = await wordModel.findByIdAndUpdate(id, validatedData, {
    new: true,
    runValidators: true,
  });

  if (!approvedWord) {
    res.status(404);
    throw new Error("Word not found");
  }

  res.json({ success: true, data: approvedWord });
});
