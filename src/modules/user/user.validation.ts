import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  username: z.string().min(4),
  password: z.string().min(6),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.email().optional(),
  username: z.string().min(3).optional(),
});
