import { Request, Response } from "express";
import Word from "./word.model";
import asyncHandler from "../../utils/asyncHandler";
import { WordDTO } from "./word.types";
import mongoose from "mongoose";

export const getWords = asyncHandler(async (_req: Request, res: Response) => {
  const words = await Word.find({ isApproved: true });

  const data: WordDTO[] = words.map((w) => ({
    id: w.id,
    word: w.word,
    diacritic: w.diacritic,
    meaning: w.meaning,
    explanation: w.explanation,
    example: w.example,
    category: w.category,
    rarity: w.rarity,
  }));

  res.json({
    count: data.length,
    data,
  });
});

export const getWord = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid word id" });
    return;
  }

  const word = await Word.findById(id);

  if (!word) {
    res.status(404).json({ message: "Word not found" });
    return;
  }

  res.json({ word });
});

export const getRandomWord = asyncHandler(
  async (_req: Request, res: Response) => {
    const count = await Word.countDocuments();
    const random = Math.floor(Math.random() * count);
    const word = await Word.findOne().skip(random);

    res.json({
      data: word,
    });
  }
);
