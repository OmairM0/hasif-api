import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, { message: "password is short" }),
});

export const signupSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  username: z.string().min(4),
  password: z.string().min(6),
});
