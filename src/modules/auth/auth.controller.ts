import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { loginSchema, signupSchema } from "./auth.validation";
import { loginService } from "./auth.services";
import userModel from "../user/user.model";
import { hashPassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";

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

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = signupSchema.parse(req.body);

  const { name, email, username, password } = validatedData;

  // 1) check existing
  const userExists = await userModel.exists({
    $or: [{ email }, { username }],
  });

  if (userExists) {
    res.status(409);
    throw new Error("User already exists");
  }

  // 2) hash password
  const hashedPassword = await hashPassword(password);

  // 3) create user
  const createdUser = await userModel.create({
    name,
    email,
    username,
    password: hashedPassword,
    role: "user",
  });

  // 4) generate token
  const token = generateToken({
    id: createdUser.id.toString(),
    role: createdUser.role,
  });

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: createdUser.id.toString(),
        name: createdUser.name,
        email: createdUser.email,
        username: createdUser.username,
        role: createdUser.role,
      },
      token,
    },
  });
});
