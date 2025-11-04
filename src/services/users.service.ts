import { apiPost } from "./apiClient";

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: number;
    email: string;
  };
};

export function registerUser(payload: RegisterInput): Promise<{ id: string }> {
  return apiPost<{ id: string }>("/api/users/register", payload);
}

export function loginUser(payload: LoginInput): Promise<LoginResponse> {
  return apiPost<LoginResponse>("/api/auth/login", payload);
}
