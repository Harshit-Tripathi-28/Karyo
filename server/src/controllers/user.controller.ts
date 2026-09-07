import { Response } from "express";
import type { AuthenticatedRequest } from "../types/express";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

export const getCurrentUser = async (
  req: AuthenticatedRequest,
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
      resumeAnalysis: user.resumeAnalysis ?? null,
      createdAt: user.createdAt,
    },
  });
};

export const updateProfile = async (
  req: AuthenticatedRequest,
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
    const trimmedRole = targetRole.trim();
    user.targetRole = trimmedRole;

    if (user.resumeAnalysis) {
      user.resumeAnalysis = {
        ...user.resumeAnalysis,
        targetRole: trimmedRole,
      };
      user.markModified("resumeAnalysis");
    }
  }

  if (Array.isArray(skills)) {
    const updatedSkills = skills
      .filter((skill): skill is string => typeof skill === "string")
      .map((skill) => skill.trim())
      .filter(Boolean);

    user.skills = updatedSkills;

    if (user.resumeAnalysis) {
      user.resumeAnalysis = {
        ...user.resumeAnalysis,
        skills: updatedSkills,
      };
      user.markModified("resumeAnalysis");
    }
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
      resumeAnalysis: user.resumeAnalysis ?? null,
      createdAt: user.createdAt,
    },
  });
};