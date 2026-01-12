import mongoose, { Schema, Document } from "mongoose";
import { WordEntity } from "./words.types";

export interface WordDocument extends WordEntity, Document {}

const wordSchema = new Schema<WordDocument>(
  {
    word: { type: String, required: true },
    diacritic: { type: String, required: true },
    meaning: { type: String, required: true },
    explanation: { type: String, required: true },
    example: { type: String, required: true },
    category: { type: String, required: true },
    rarity: { type: Number, required: true },

    // backend-only
    isApproved: { type: Boolean, default: true },
    createdBy: String,
  },
  { timestamps: true }
);

export default mongoose.model<WordDocument>("Word", wordSchema);
