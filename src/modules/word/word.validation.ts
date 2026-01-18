import { z } from "zod";

export const createWordSchema = z.object({
  word: z.string(),
  diacritic: z.string(),
  meaning: z.string(),
  explanation: z.string(),
  example: z.string(),
  category: z.string(),
});
