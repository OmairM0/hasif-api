import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import User from "./user.model";
import { hashPassword } from "../../utils/hash";
import { loginService } from "../auth/auth.services";
import { error } from "node:console";
import { generateToken } from "../../utils/jwt";
import { createUserSchema } from "./user.validation";

type CreateAdminBody = {
  email: string;
  password: string;
};

// export const createAdmin = asyncHandler(async (req: Request, res: Response) => {
//   const { name, email, username, password } = req.body;

//   const createdAdmin = await User.create({
//     name,
//     email,
//     username,
//     password,
//     role: "admin",
//   });

//   res.status(201).json({
//     success: true,
//     data: createdAdmin,
//   });
// });

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = createUserSchema.parse(req.body);

  const { name, email, username, password } = validatedData;

  // 1) check existing
  const userExists = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (userExists) {
    res.status(400);
    throw new Error("Email or username already exists");
  }

  // 2) hash password
  const hashedPassword = await hashPassword(password);

  // 3) create user
  const createdUser = await User.create({
    name,
    email,
    username,
    password: hashedPassword,
    role: "user",
  });

  // 4) generate token
  const token = generateToken({
    id: createdUser._id.toString(),
    role: createdUser.role,
  });

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        username: createdUser.username,
        role: createdUser.role,
      },
      token,
    },
  });
});
