import { Router } from "express";
import { getWords } from "./words.controller";

const router = Router();

router.get("/", getWords);

export default router;
