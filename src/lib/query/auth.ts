import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types";

// ── Login ─────────────────────────────────────────────────────────────────────
export function useLogin() {
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      // API shape: { success, data: { user: {...}, token: '...' } }
      const raw = data as unknown as Record<string, unknown>;
      const inner = (raw.data ?? raw) as Record<string, unknown>;
      const user = (inner.user ?? inner) as User;
      const token = (inner.token ?? inner.accessToken ?? raw.token) as string;
      if (user && token) setAuth(user, token);
    },
  });
}

// ── Register ──────────────────────────────────────────────────────────────────
export function useRegister() {
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: ({
      name,
      email,
      phone,
      password,
    }: {
      name: string;
      email: string;
      phone?: string;
      password: string;
    }) => authApi.register(name, email, password, phone),
    onSuccess: (data) => {
      const raw = data as unknown as Record<string, unknown>;
      const inner = (raw.data ?? raw) as Record<string, unknown>;
      const user = (inner.user ?? inner) as User;
      const token = (inner.token ?? inner.accessToken ?? raw.token) as string;
      if (user && token) setAuth(user, token);
    },
  });
}

// ── Profile ───────────────────────────────────────────────────────────────────
export function useProfile() {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const data = await authApi.getProfile();
      const raw = data as unknown as Record<string, unknown>;
      return (
        ((raw.data ?? raw) as Record<string, unknown>).user ?? raw.data ?? raw
      );
    },
    enabled: !!token,
  });
}
