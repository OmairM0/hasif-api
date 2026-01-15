import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  username: z.string().min(4),
  password: z.string().min(6),
  // role: z.enum(["admin", "user"]),
});
