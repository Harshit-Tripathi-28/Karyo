import { apiRequest } from "./api";
import type { AuthResponse } from "../types/auth";

export interface ResumeAnalysis {
  professionalSummary: string;
  targetRole: string;
  careerScore: number;
  skills: string[];

  experience: {
    company: string;
    role: string;
    duration: string;
    highlights: string[];
  }[];

  education: {
    institution: string;
    degree: string;
    field: string;
    duration: string;
  }[];

  projects: {
    name: string;
    description: string;
    technologies: string[];
  }[];

  strengths: string[];
  skillGaps: string[];
  recommendations: string[];
}

export interface ResumeAnalysisResponse {
  success: boolean;
  message: string;
  resumeAnalysis: ResumeAnalysis;
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