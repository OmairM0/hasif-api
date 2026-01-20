import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "./category.controller";
import { adminOnly, protect } from "../../middlewares/protect";

const router = Router();

router.get("/", getCategories);
router.post("/", protect, adminOnly, createCategory);

router.patch("/:id", protect, adminOnly, updateCategory);

router.get("/:id", getCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
