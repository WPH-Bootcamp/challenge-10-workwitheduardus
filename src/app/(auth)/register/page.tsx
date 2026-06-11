'use client';
 
import Link from 'next/link';
import Image from "next/image";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from "lucide-react";
import { useRegister } from "@/lib/query/auth";
 
export default function RegisterPage() {
  const router = useRouter();
  const { mutate: register, isPending, isError } = useRegister();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  function validate() {
    const e: typeof errors = {};
    if (!name) e.name = "Nama wajib diisi";
    if (!email) e.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Format email tidak valid";
    if (!phone) e.phone = "Nomor telepon wajib diisi";
    if (!password) e.password = "Password wajib diisi";
    else if (password.length < 8) e.password = "Password minimal 8 karakter";
    if (confirmPassword !== password) e.confirmPassword = "Password tidak sama";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    register(
      { name, email, phone, password },
      { onSuccess: () => router.push("/") },
    );
  }

  const inputBox = (hasError?: string) =>
    [
      "flex items-center gap-2 h-14 px-3 border rounded-xl transition-colors",
      hasError ? "border-[#C12116]" : "border-[#D5D7DA]",
    ].join(" ");

  const errorText = (msg?: string) =>
    msg ? (
      <p className="font-semibold text-[14px] leading-7 tracking-[-0.02em] text-[#C12116]">
        {msg}
      </p>
    ) : null;

  const inputClass =
    "flex-1 font-normal text-[16px] leading-[30px] tracking-[-0.02em] text-neutral-950 placeholder:text-[#717680] bg-transparent outline-none";

  return (
    <div className="min-h-screen bg-white flex">
      {/*  LEFT: hero image — desktop only  */}
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

      {/*  RIGHT: form  */}
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
            {/* Sign in — inactive */}
            <Link
              href="/login"
              className="flex-1 flex items-center justify-center h-10 rounded-xl"
            >
              <span className="font-medium text-[16px] leading-[30px] tracking-[-0.03em] text-[#535862]">
                Sign in
              </span>
            </Link>
            {/* Sign up — active */}
            <div className="flex-1 flex items-center justify-center h-10 bg-white rounded-xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)]">
              <span className="font-bold text-[16px] leading-[30px] tracking-[-0.02em] text-neutral-950">
                Sign up
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <div className={inputBox(errors.name)}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((p) => ({ ...p, name: "" }));
                  }}
                  placeholder="Nama Lengkap"
                  className={inputClass}
                />
              </div>
              {errorText(errors.name)}
            </div>

            {/* Email */}
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
                  className={inputClass}
                />
              </div>
              {errorText(errors.email)}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <div className={inputBox(errors.phone)}>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrors((p) => ({ ...p, phone: "" }));
                  }}
                  placeholder="Nomor Telepon"
                  className={inputClass}
                />
              </div>
              {errorText(errors.phone)}
            </div>

            {/* Password */}
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
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="flex-shrink-0 text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errorText(errors.password)}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <div className={inputBox(errors.confirmPassword)}>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((p) => ({ ...p, confirmPassword: "" }));
                  }}
                  placeholder="Konfirmasi Password"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="flex-shrink-0 text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errorText(errors.confirmPassword)}
            </div>
            {isError && (
              <p className="font-semibold text-[14px] leading-7 tracking-[-0.02em] text-[#C12116]">
                Pendaftaran gagal. Email mungkin sudah digunakan.
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-[#C12116] hover:bg-red-700 active:bg-red-800 rounded-[100px] font-bold text-[16px] leading-[30px] tracking-[-0.02em] text-[#FDFDFD] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Loading..." : "Register"}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center font-medium text-[14px] leading-[28px] text-[#535862]">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-bold text-neutral-950 underline underline-offset-2 hover:text-[#C12116] transition-colors"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}