import { Router } from "express";
import { getRandomWord, getWords } from "./words.controller";

const router = Router();

router.get("/", getWords);
router.get("/random", getRandomWord);

export default router;
