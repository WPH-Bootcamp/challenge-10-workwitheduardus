import api from "./axios";
import type { User, AuthResponse, UpdateProfilePayload } from "@/types";

export const authApi = {
  register: (body: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<AuthResponse> =>
    api.post<AuthResponse>("/api/auth/register", body).then((r) => r.data),

  // POST 
  login: (body: { email: string; password: string }): Promise<AuthResponse> =>
    api.post<AuthResponse>("/api/auth/login", body).then((r) => r.data),

  // GET
  getProfile: (): Promise<User> =>
    api.get<User>("/api/auth/profile").then((r) => r.data),

  // PUT
  updateProfile: (body: UpdateProfilePayload): Promise<User> =>
    api.put<User>("/api/auth/profile", body).then((r) => r.data),
};
