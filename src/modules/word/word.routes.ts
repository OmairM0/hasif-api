import { Router } from "express";
import { getRandomWord, getWord, getWords } from "./word.controller";

const router = Router();

router.get("/", getWords);
router.get("/random", getRandomWord);
router.get("/:id", getWord);

export default router;
