"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Sidebar from "@/components/shared/Sidebar";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api/axios";

export default function ProfilePage() {
  const { user, setAuth, token } = useAuthStore();
  const qc = useQueryClient();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    mutate: updateProfile,
    isPending,
    isError,
  } = useMutation({
    mutationFn: () => api.put("/api/auth/profile", { name, phone }),
    onSuccess: (res) => {
      const updated = res.data?.data?.user ?? res.data?.data ?? res.data;
      if (updated && token) setAuth({ ...user!, ...updated }, token);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header scrolled />
      </div>

      <main className="flex-1 pt-24 pb-16 px-4 lg:px-[120px]">
        <div className="flex flex-col lg:flex-row gap-6">
          <Sidebar />

          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] p-6 lg:p-8">
              <h1
                style={{ fontSize: "24px", fontWeight: 800 }}
                className="text-neutral-950 mb-6"
              >
                Profile
              </h1>

              {/* Avatar */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-200">
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={96}
                        height={96}
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center">
                        <span className="text-white font-bold text-3xl">
                          {user?.name?.[0]?.toUpperCase() ?? "U"}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition-colors"
                  >
                    <Camera size={14} className="text-white" />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Form */}
              <div className="max-w-[480px] mx-auto flex flex-col gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label
                    style={{ fontSize: "13px", fontWeight: 600 }}
                    className="text-neutral-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 border border-neutral-300 rounded-xl px-4 text-[15px] text-neutral-950 outline-none focus:border-primary transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email — read only */}
                <div className="flex flex-col gap-1.5">
                  <label
                    style={{ fontSize: "13px", fontWeight: 600 }}
                    className="text-neutral-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="h-12 border border-neutral-200 rounded-xl px-4 text-[15px] text-neutral-500 outline-none bg-neutral-50 cursor-not-allowed"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label
                    style={{ fontSize: "13px", fontWeight: 600 }}
                    className="text-neutral-700"
                  >
                    Number Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 border border-neutral-300 rounded-xl px-4 text-[15px] text-neutral-950 outline-none focus:border-primary transition-colors"
                    placeholder="Your phone number"
                  />
                </div>

                {/* Feedback */}
                {success && (
                  <p
                    style={{ fontSize: "14px", fontWeight: 600 }}
                    className="text-green-600"
                  >
                    ✓ Profile updated successfully!
                  </p>
                )}
                {isError && (
                  <p
                    style={{ fontSize: "14px", fontWeight: 600 }}
                    className="text-primary"
                  >
                    Failed to update profile. Try again.
                  </p>
                )}

                {/* Submit */}
                <button
                  onClick={() => updateProfile()}
                  disabled={isPending}
                  className="w-full h-12 bg-primary rounded-full text-white font-bold text-[16px] hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? "Saving..." : "Update Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
