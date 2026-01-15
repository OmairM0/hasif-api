import { Router } from "express";
import {
  createWord,
  getRandomWord,
  getWord,
  getWords,
} from "./word.controller";
import { adminOnly, protect } from "../../middlewares/protect";

const router = Router();

router.get("/", getWords);
router.post("/", protect, adminOnly, createWord);

router.get("/random", getRandomWord);
router.get("/:id", getWord);

export default router;
