import User from "../user/user.model";
import { comparePassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";
import { AppError } from "../../utils/appError";

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken({
    id: user._id.toString(),
    role: user.role,
  });

  return { token, user };
};
