"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "../../../lib/query/auth";

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending, isError } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    login({ email, password }, { onSuccess: () => router.push("/") });
  }

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:block relative w-[720px] h-screen flex-shrink-0 overflow-hidden bg-neutral-100">
        <Image
          src="/burger-login-regis.png"
          alt="Foody hero"
          fill
          sizes="720px"
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* ── RIGHT: form panel */}
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
            <span className="font-extrabold text-[32px] leading-[42px] text-neutral-950">
              Foody
            </span>
          </Link>

          {/* Heading */}
          <div className="flex flex-col gap-1">
            <h1 className="font-extrabold text-[28px] leading-[38px] text-neutral-950">
              Welcome Back
            </h1>
            <p className="font-medium text-[16px] leading-[30px] tracking-[-0.03em] text-neutral-950">
              Good to see you again! Let&apos;s eat
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center gap-2 p-2 h-14 bg-[#F5F5F5] rounded-2xl">
            {/* Sign in */}
            <div className="flex-1 flex items-center justify-center h-10 bg-white rounded-xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)]">
              <span className="font-bold text-[16px] leading-[30px] tracking-[-0.02em] text-neutral-950">
                Sign in
              </span>
            </div>
            {/* Sign up */}
            <Link
              href="/register"
              className="flex-1 flex items-center justify-center h-10 rounded-xl"
            >
              <span className="font-medium text-[16px] leading-[30px] tracking-[-0.03em] text-[#535862]">
                Sign up
              </span>
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <div
                className={[
                  "flex items-center gap-2 h-14 px-3 border rounded-xl transition-colors",
                  errors.email ? "border-[#C12116]" : "border-[#D5D7DA]",
                ].join(" ")}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: "" }));
                  }}
                  placeholder="Email"
                  className="flex-1 font-normal text-[16px] leading-[30px] tracking-[-0.02em] text-neutral-950 placeholder:text-[#717680] bg-transparent outline-none"
                />
              </div>
              {errors.email && (
                <p className="font-semibold text-[14px] leading-7 tracking-[-0.02em] text-[#C12116]">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <div
                className={[
                  "flex items-center gap-2 h-14 px-3 border rounded-xl transition-colors",
                  errors.password ? "border-[#C12116]" : "border-[#D5D7DA]",
                ].join(" ")}
              >
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((p) => ({ ...p, password: "" }));
                  }}
                  placeholder="Password"
                  className="flex-1 font-normal text-[16px] leading-[30px] tracking-[-0.02em] text-neutral-950 placeholder:text-[#717680] bg-transparent outline-none"
                />
                {/* Eye icon */}
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="flex-shrink-0 text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="font-semibold text-[14px] leading-7 tracking-[-0.02em] text-[#C12116]">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-5 h-5 rounded-md border border-[#D5D7DA] accent-[#C12116] cursor-pointer flex-shrink-0"
              />
              <label
                htmlFor="remember"
                className="font-medium text-[16px] leading-[30px] tracking-[-0.03em] text-neutral-950 cursor-pointer select-none"
              >
                Remember Me
              </label>
            </div>

            {/* API error */}
            {isError && (
              <p className="font-semibold text-[14px] leading-7 tracking-[-0.02em] text-[#C12116]">
                Email atau password salah. Coba lagi.
              </p>
            )}

            {/* Submit — Button*/}
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-[#C12116] hover:bg-red-700 active:bg-red-800 rounded-[100px] font-bold text-[16px] leading-[30px] tracking-[-0.02em] text-[#FDFDFD] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Loading..." : "Login"}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center font-medium text-[14px] leading-[28px] text-[#535862]">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-bold text-neutral-950 underline underline-offset-2 hover:text-[#C12116] transition-colors"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}