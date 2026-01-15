import { Router } from "express";
import { createUser } from "./user.controller";

const router = Router();

router.post("/", createUser);

export default router;
