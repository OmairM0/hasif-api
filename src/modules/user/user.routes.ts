import { Router } from "express";
import {
  createUser,
  getMe,
  getUser,
  getUsers,
  updateUser,
} from "./user.controller";
import { adminOnly, protect } from "../../middlewares/protect";

const router = Router();

router.get("/", protect, adminOnly, getUsers);
router.post("/", protect, adminOnly, createUser);
router.patch("/", protect, updateUser);

router.get("/me", protect, getMe);
router.get("/:id", protect, getUser);

export default router;
