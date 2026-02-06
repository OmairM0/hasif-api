import { Types } from "mongoose";

/**
 * API response contract
 * (must match frontend IWord)
 */
export interface WordDTO {
  id: string;
  word: string;
  diacritic: string;
  meaning: string;
  explanation: string;
  example: string;
  category: Types.ObjectId;
  // rarity: number;
}

/**
 * Internal backend entity
 */
export interface WordEntity extends WordDTO {
  status: "pending" | "approved" | "rejected";
  createdBy: Types.ObjectId;
}
