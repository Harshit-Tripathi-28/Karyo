import { apiRequest } from "./api";
import type { AuthResponse, User } from "../types/auth";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface CurrentUserResponse {
  success: boolean;
  user: User;
}

export const registerUser = (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const loginUser = (
  payload: LoginPayload
): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getCurrentUser = (
  token: string
): Promise<CurrentUserResponse> => {
  return apiRequest<CurrentUserResponse>("/users/me", {
    method: "GET",
    token,
  });
};