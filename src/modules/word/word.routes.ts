import { Router } from "express";
import {
  changeWordStatus,
  createWord,
  deleteWord,
  getRandomWord,
  getWord,
  getWords,
  updateWord,
} from "./word.controller";
import { adminOnly, optionalAuth, protect } from "../../middlewares/protect";

const router = Router();

router.get("/", optionalAuth, getWords);
router.post("/", protect, createWord);

router.get("/random", getRandomWord);
router.get("/:id", getWord);
router.patch("/:id", protect, updateWord);
router.delete("/:id", protect, adminOnly, deleteWord);
router.patch("/:id/status", protect, adminOnly, changeWordStatus);

export default router;
