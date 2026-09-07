import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

interface AuthTokenPayload {
  userId: string;
}

const createToken = (userId: string): string => {
  return jwt.sign(
    { userId } satisfies AuthTokenPayload,
    env.jwtSecret,
    {
      expiresIn: "7d",
    }
  );
};

const sanitizeUser = (user: {
  id: string;
  name: string;
  email: string;
  targetRole?: string;
  skills: string[];
  careerScore: number;
  resumeAnalysis?: unknown;
  createdAt: Date;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  targetRole: user.targetRole,
  skills: user.skills,
  careerScore: user.careerScore,
  resumeAnalysis: user.resumeAnalysis ?? null,
  createdAt: user.createdAt,
});

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedName.length < 2) {
    throw new ApiError(400, "Name must contain at least 2 characters");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  if (password.length < 8) {
    throw new ApiError(
      400,
      "Password must contain at least 8 characters"
    );
  }

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "An account with this email already exists"
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: normalizedName,
    email: normalizedEmail,
    passwordHash,
  });

  return {
    token: createToken(user.id),
    user: sanitizeUser(user),
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

  return {
    token: createToken(user.id),
    user: sanitizeUser(user),
  };
};