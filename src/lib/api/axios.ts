import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import type { AuthState } from "@/store/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState() as AuthState;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url: string = err.config?.url ?? "";
    const method: string = (err.config?.method ?? "get").toLowerCase();
    const status: number = err.response?.status;

    if (status !== 401) return Promise.reject(err);

    if (url.startsWith("/api/resto")) return Promise.reject(err);

    if (method === "get") return Promise.reject(err);

    const isStrictlyAuthRequired =
      url.includes("/api/auth/profile") ||
      url.includes("/api/cart") ||
      url.includes("/api/order") ||
      url.includes("/api/review");

    if (isStrictlyAuthRequired) {
      (useAuthStore.getState() as AuthState).clearAuth();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  },
);

export default api;
