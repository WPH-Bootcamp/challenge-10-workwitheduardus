import api from "./axios";
import type { User, AuthResponse, UpdateProfilePayload } from "@/types";

export const authApi = {
  // POST /api/auth/login
  login: (email: string, password: string): Promise<AuthResponse> =>
    api
      .post<AuthResponse>("/api/auth/login", { email, password })
      .then((r) => r.data),

  // POST /api/auth/register
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string,
  ): Promise<AuthResponse> =>
    api
      .post<AuthResponse>("/api/auth/register", {
        name,
        email,
        password,
        phone,
      })
      .then((r) => r.data),

  // GET /api/auth/profile  (auth)
  getProfile: (): Promise<User> =>
    api.get<User>("/api/auth/profile").then((r) => r.data),

  // PUT /api/auth/profile  (auth)
  updateProfile: (body: UpdateProfilePayload): Promise<User> =>
    api.put<User>("/api/auth/profile", body).then((r) => r.data),
};
