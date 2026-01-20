import { z } from "zod";

export const createWordSchema = z.object({
  word: z.string(),
  diacritic: z.string(),
  meaning: z.string(),
  explanation: z.string(),
  example: z.string(),
  category: z.string(),
});

export const updateWordSchema = z.object({
  word: z.string().optional(),
  diacritic: z.string().optional(),
  meaning: z.string().optional(),
  explanation: z.string().optional(),
  example: z.string().optional(),
  category: z.string().optional(),
});

export const approveWordSchema = z.object({
  isApproved: z.boolean(),
});
