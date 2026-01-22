import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import userModel from "../modules/user/user.model";

export const protect = asyncHandler(
  async (req: Request, res: Response, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const token = authHeader.split(" ")[1];

    // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    //   id: string;
    //   role: string;
    // };
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        role: string;
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401);
        throw new Error("Token expired");
      } 

      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401);
        throw new Error("Invalid token");
      }

      res.status(401);
      throw new Error("Authentication failed");
    }

    const user = await userModel.findById(decoded.id).select("role");

    if (!user) {
      res.status(401);
      throw new Error("Not authorized");
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

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

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    const user = await userModel.findById(decoded.id).select("role");

    if (user) {
      req.user = {
        id: user.id,
        role: user.role,
      };
    }
  } catch {}

  next();
};
