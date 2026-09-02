export interface User {
  id: string;
  name: string;
  email: string;
  targetRole?: string;
  skills: string[];
  careerScore: number;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}