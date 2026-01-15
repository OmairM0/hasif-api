import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import User from "./user.model";

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
  const { name, email, username, password } = req.body;

  const createdAdmin = await User.create({
    name,
    email,
    username,
    password,
    role: "user",
  });

  res.status(201).json({
    success: true,
    data: createdAdmin,
  });
});
