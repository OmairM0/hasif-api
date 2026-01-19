import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategory,
} from "./category.controller";
import { adminOnly, protect } from "../../middlewares/protect";

const router = Router();

router.get("/", getCategories);
router.post("/", protect, adminOnly, createCategory);

router.get("/:id", getCategory);

export default router;
