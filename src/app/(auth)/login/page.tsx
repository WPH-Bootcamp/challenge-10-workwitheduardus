"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api/auth";
import type { User } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  function validate() {
    const e: typeof errors = {};
    if (!email) e.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Format email tidak valid";
    if (!password) e.password = "Password wajib diisi";
    else if (password.length < 6) e.password = "Password minimal 6 karakter";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      const raw = await authApi.login(email, password);
      // Handle both API shapes:
      // { success, data: { user: {}, token: '' } }
      // { user: {}, token: '' }
      const data = raw as unknown as Record<string, unknown>;
      const inner = (data.data ?? data) as Record<string, unknown>;
      const user = (inner.user ?? inner) as User;
      const token = (inner.token ?? inner.accessToken ?? data.token) as string;

      if (user && token) {
        setAuth(user, token);
        router.push("/");
      } else {
        setApiError("Login gagal. Coba lagi.");
      }
    } catch {
      setApiError("Email atau password salah.");
    } finally {
      setLoading(false);
    }
  }

  const inputBox = (err?: string) =>
    [
      "flex items-center gap-2 h-14 px-3 border rounded-xl transition-colors",
      err ? "border-[#C12116]" : "border-[#D5D7DA]",
    ].join(" ");

  return (
    <div className="min-h-screen bg-white flex">
      {/* Hero image — desktop only */}
      <div className="hidden lg:block relative w-[720px] h-screen flex-shrink-0 overflow-hidden">
        <Image
          src="/burger-login-regis.svg"
          alt="Foody"
          fill
          priority
          sizes="720px"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
        <div className="w-full max-w-[374px] flex flex-col gap-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-[15px]">
            <div className="relative w-[42px] h-[42px] flex-shrink-0">
              <Image
                src="/Logo-red.svg"
                alt="Foody"
                fill
                sizes="42px"
                className="object-contain"
              />
            </div>
            <span
              style={{ fontSize: "32px", fontWeight: 800, lineHeight: "42px" }}
              className="text-neutral-950"
            >
              Foody
            </span>
          </Link>

          {/* Heading */}
          <div className="flex flex-col gap-1">
            <h1
              style={{ fontSize: "28px", fontWeight: 800, lineHeight: "38px" }}
              className="text-neutral-950"
            >
              Welcome Back
            </h1>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 500,
                letterSpacing: "-0.03em",
              }}
              className="text-neutral-950"
            >
              Good to see you again! Let&apos;s eat
            </p>
          </div>

          {/* Tab switcher */}
          <div
            className="flex items-center gap-2 p-2 bg-[#F5F5F5] rounded-2xl"
            style={{ height: "56px" }}
          >
            <div
              className="flex-1 flex items-center justify-center bg-white rounded-xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
              style={{ height: "40px" }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
                className="text-neutral-950"
              >
                Sign in
              </span>
            </div>
            <Link
              href="/register"
              className="flex-1 flex items-center justify-center rounded-xl"
              style={{ height: "40px" }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                }}
                className="text-[#535862]"
              >
                Sign up
              </span>
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className={inputBox(errors.email)}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: "" }));
                  }}
                  placeholder="Email"
                  className="flex-1 text-[16px] font-normal text-neutral-950 placeholder:text-[#717680] bg-transparent outline-none"
                />
              </div>
              {errors.email && (
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                  className="text-[#C12116]"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className={inputBox(errors.password)}>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((p) => ({ ...p, password: "" }));
                  }}
                  placeholder="Password"
                  className="flex-1 text-[16px] font-normal text-neutral-950 placeholder:text-[#717680] bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="flex-shrink-0 text-neutral-500 hover:text-neutral-700"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                  className="text-[#C12116]"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-5 h-5 rounded-md border border-[#D5D7DA] accent-[#C12116] cursor-pointer"
              />
              <label
                htmlFor="remember"
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                }}
                className="text-neutral-950 cursor-pointer select-none"
              >
                Remember Me
              </label>
            </div>

            {apiError && (
              <p
                style={{ fontSize: "14px", fontWeight: 600 }}
                className="text-[#C12116]"
              >
                {apiError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                height: "48px",
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
              className="w-full bg-[#C12116] hover:bg-red-700 rounded-[100px] text-[#FDFDFD] transition-colors disabled:opacity-60"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <p
            style={{ fontSize: "14px", fontWeight: 500 }}
            className="text-center text-[#535862]"
          >
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-bold text-neutral-950 underline hover:text-[#C12116]"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
