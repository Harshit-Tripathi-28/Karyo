import { apiRequest } from "./api";
import type { User } from "../types/auth";
import type {
  ResumeExperience,
  ResumeProject,
  ResumeEducation,
} from "../types/resume";

export interface UpdateProfilePayload {
  name?: string;
  targetRole?: string;
  skills?: string[];
  experience?: ResumeExperience[];
  projects?: ResumeProject[];
  education?: ResumeEducation[];
  professionalSummary?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  user: User;
}

export const updateUserProfile = (
  token: string,
  payload: UpdateProfilePayload
): Promise<UpdateProfileResponse> => {
  return apiRequest<UpdateProfileResponse>("/users/profile", {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
};
