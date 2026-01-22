import { Router } from "express";
import {
  changePassword,
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
router.patch("/changePassword", protect, changePassword);
router.get("/:id", protect, getUser);

export default router;
