import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";

export const protect = asyncHandler(
  async (req: Request, res: Response, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    req.user = decoded;

    next();
  }
);

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Admins only");
  }
  next();
};
