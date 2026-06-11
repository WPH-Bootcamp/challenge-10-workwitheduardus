import axios from "axios";
import { useAuthStore, AuthState } from "../../store/authStore";


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState() as AuthState;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      (useAuthStore.getState() as AuthState).clearAuth();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export default api;
