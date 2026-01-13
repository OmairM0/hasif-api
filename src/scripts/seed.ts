/*
  # scripts to seed initial words to Words collections
  # Run script:
    --> pnpm dlx ts-node src/scripts/seed.ts
*/

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import wordsModel from "../modules/words/words.model";
import { WordEntity, WordDTO } from "../modules/words/words.types";

async function seed() {
  dotenv.config();
  await mongoose.connect(process.env.MONGO_URI!);

  const filePath = path.join(__dirname, "words.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const readyWords: WordEntity[] = data.map((word: WordDTO) => {
    return { ...word, isApproved: true, createdBy: null };
  });
  // console.log(readyWords[0]);

  await wordsModel.insertMany(data);

  console.log("✅ Words inserted successfully");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
