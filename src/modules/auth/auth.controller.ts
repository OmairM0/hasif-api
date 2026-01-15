import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import User from "../user/user.model";
import { loginSchema } from "./auth.validation";
import { loginService } from "./auth.services";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);

  const { token, user } = await loginService(data.email, data.password);

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token,
    },
  });
});
