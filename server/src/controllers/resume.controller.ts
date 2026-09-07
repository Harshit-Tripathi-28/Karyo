import { Response } from "express";
import type { AuthenticatedRequest } from "../types/express";
import { processResume } from "../services/resume.service";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

export const uploadAndAnalyzeResume = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    throw new ApiError(401, "Authentication required");
  }

  if (!req.file) {
    throw new ApiError(
      400,
      "Please upload a PDF resume"
    );
  }

  const result = await processResume(
    req.userId,
    req.file.buffer
  );

  res.status(200).json({
    success: true,
    message: "Resume analyzed successfully",
    ...result,
  });
};

export const getResumeAnalysis = async (
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

  if (!user.resumeAnalysis) {
    throw new ApiError(404, "No resume analysis found for this account");
  }

  res.status(200).json({
    success: true,
    resumeAnalysis: user.resumeAnalysis,
  });
};

export const deleteResume = async (
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

  user.resumeText = "";
  user.resumeAnalysis = undefined;
  user.skills = [];
  user.targetRole = undefined;
  user.careerScore = 0;
  user.markModified("resumeAnalysis");

  await user.save();

  res.status(200).json({
    success: true,
    message: "Resume analysis and career data cleared successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      skills: user.skills,
      careerScore: user.careerScore,
      resumeAnalysis: null,
      createdAt: user.createdAt,
    },
  });
};