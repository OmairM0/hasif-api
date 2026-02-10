import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { comparePassword, hashPassword } from "../../utils/hash";
import { loginService } from "../auth/auth.services";
import { error } from "node:console";
import { generateToken } from "../../utils/jwt";
import {
  changePasswordSchema,
  createUserSchema,
  updateUserSchema,
} from "./user.validation";
import userModel from "./user.model";
import mongoose from "mongoose";
import { getPagination } from "../../utils/pagination";
import { promise } from "zod";

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

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = req.query;
  const {
    skip,
    limit: pageLimit,
    page: currentPage,
  } = getPagination({
    page: Number(page),
    limit: Number(limit),
  });

  const [users, total] = await Promise.all([
    userModel
      .find({}, "name email username role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit)
      .lean(),
    userModel.countDocuments(),
  ]);

  const data = users.map((u) => ({
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    username: u.username,
    role: u.role,
  }));

  res.json({
    success: true,
    count: users.length,
    data,
    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      totalPages: Math.ceil(total / pageLimit),
      hasNext: skip + pageLimit < total,
      hasPrev: currentPage > 1,
    },
  });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid user id");
  }

  const user = await userModel.findById(id, "name email username").lean();

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    success: true,
    data: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      username: user.username,
    },
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id as string;

  const user = await userModel.findById(id, "name email username").lean();

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    success: true,
    data: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = createUserSchema.parse(req.body);

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

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id as string;

  const validatedData = updateUserSchema.parse(req.body);

  if (Object.keys(validatedData).length === 0) {
    res.status(400);
    throw new Error("No data provided for update");
  }

  // check email / username uniqueness (if provided)
  if (validatedData.email || validatedData.username) {
    const exists = await userModel.exists({
      _id: { $ne: id },
      $or: [
        validatedData.email ? { email: validatedData.email } : {},
        validatedData.username ? { username: validatedData.username } : {},
      ],
    });

    if (exists) {
      res.status(409);
      throw new Error("Email or username already exists");
    }
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    id,
    { $set: validatedData },
    { new: true, runValidators: true },
  );

  if (!updatedUser) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    data: {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
      role: updatedUser.role,
    },
  });
});

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.user?.id as string;

    const validatedData = changePasswordSchema.parse(req.body);
    if (validatedData.oldPassword === validatedData.newPassword) {
      res.status(400);
      throw new Error("New password must be different from old password");
    }

    const user = await userModel.findById(id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const isMatch = await comparePassword(
      validatedData.oldPassword,
      user.password,
    );

    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    user.password = await hashPassword(validatedData.newPassword);
    await user.save();

    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
    });

    res.json({
      success: true,
      message: "Password changed successfully",
      token,
    });
  },
);
//
