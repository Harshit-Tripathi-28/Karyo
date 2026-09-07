import type { ResumeAnalysis } from "./resume";

export interface User {
  id: string;
  name: string;
  email: string;
  targetRole?: string;
  skills: string[];
  careerScore: number;
  resumeAnalysis?: ResumeAnalysis | null;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}