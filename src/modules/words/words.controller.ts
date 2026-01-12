import { Request, Response } from "express";
import Word from "./words.model";
import asyncHandler from "../../utils/asyncHandler";
import { WordDTO } from "./words.types";

export const getWords = asyncHandler(async (_req: Request, res: Response) => {
  const words = await Word.find({ isApproved: true });

  const data: WordDTO[] = words.map((w) => ({
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
