import { apiPost } from "./apiClient";

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export function registerUser(payload: RegisterInput): Promise<{ id: string }> {
  return apiPost<{ id: string }>("/api/users/register", payload);
}
