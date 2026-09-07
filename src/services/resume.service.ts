import { apiRequest } from "./api";
import type { AuthResponse } from "../types/auth";
import type { ResumeAnalysis } from "../types/resume";

export type { ResumeAnalysis } from "../types/resume";

export interface ResumeAnalysisResponse {
  success: boolean;
  message: string;
  resumeAnalysis: ResumeAnalysis;
  user: AuthResponse["user"];
}

export interface DeleteResumeResponse {
  success: boolean;
  message: string;
  user: AuthResponse["user"];
}

export const analyzeResume = (
  token: string,
  file: File
): Promise<ResumeAnalysisResponse> => {
  const formData = new FormData();

  formData.append("resume", file);

  return apiRequest<ResumeAnalysisResponse>(
    "/resume/analyze",
    {
      method: "POST",
      token,
      body: formData,
      isFormData: true,
    }
  );
};

export const getResumeAnalysis = (
  token: string
): Promise<{ success: boolean; resumeAnalysis: ResumeAnalysis }> => {
  return apiRequest<{ success: boolean; resumeAnalysis: ResumeAnalysis }>(
    "/resume/analysis",
    {
      method: "GET",
      token,
    }
  );
};

export const deleteResume = (
  token: string
): Promise<DeleteResumeResponse> => {
  return apiRequest<DeleteResumeResponse>("/resume", {
    method: "DELETE",
    token,
  });
};