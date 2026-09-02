import {Response } from "express";
import type { AuthenticatedRequest } from "../types/express";
import { processResume } from "../services/resume.service";
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