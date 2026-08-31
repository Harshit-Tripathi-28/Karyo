import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/User";

interface AuthPayload {
  userId: string;
}

const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId } satisfies AuthPayload,
    env.jwtSecret,
    { expiresIn: "7d" }
  );
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  if (password.length < 8) {
    throw new ApiError(
      400,
      "Password must contain at least 8 characters"
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
  });

  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      skills: user.skills,
      careerScore: user.careerScore,
    },
  };
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+passwordHash");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      skills: user.skills,
      careerScore: user.careerScore,
    },
  };
};