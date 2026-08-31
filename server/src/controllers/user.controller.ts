import { Request, Response } from "express";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ApiError(401, "Authentication required");
  }

  const user = await User.findById(req.userId);

  if (!user) {
    throw new ApiError(404, "User account not found");
  }

  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      skills: user.skills,
      careerScore: user.careerScore,
      createdAt: user.createdAt,
    },
  });
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ApiError(401, "Authentication required");
  }

  const { name, targetRole, skills } = req.body;

  const user = await User.findById(req.userId);

  if (!user) {
    throw new ApiError(404, "User account not found");
  }

  if (typeof name === "string" && name.trim()) {
    user.name = name.trim();
  }

  if (typeof targetRole === "string") {
    user.targetRole = targetRole.trim();
  }

  if (Array.isArray(skills)) {
    user.skills = skills
      .filter((skill): skill is string => typeof skill === "string")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  await user.save();

  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      skills: user.skills,
      careerScore: user.careerScore,
    },
  });
};