import mongoose, { Schema, Document } from "mongoose";
import { WordEntity } from "./word.types";

export interface WordDocument extends WordEntity, Document {}

const wordSchema = new Schema<WordDocument>(
  {
    word: { type: String, required: true, unique: true, trim: true },
    diacritic: { type: String, required: true, trim: true },
    meaning: { type: String, required: true, trim: true },
    explanation: { type: String, required: true, trim: true },
    example: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    // rarity: { type: Number, required: true },

    // backend-only
    isApproved: { type: Boolean, default: false },
    createdBy: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

wordSchema.index({ word: 1, diacritic: 1 }, { unique: true });

export default mongoose.model<WordDocument>("Word", wordSchema);
