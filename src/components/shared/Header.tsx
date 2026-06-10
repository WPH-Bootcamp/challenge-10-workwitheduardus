"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

interface HeaderProps {
  scrolled?: boolean;
}

export default function Header({ scrolled = false }: HeaderProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { count } = useCartStore();

  return (
    <header
      className={[
        "w-full h-20 flex items-center justify-between px-[120px]",
        "transition-all duration-300",
        scrolled
          ? "bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
          : "bg-transparent",
      ].join(" ")}
    >
      <Link
        href="/"
        className="flex items-center gap-[15px] w-[149px] h-[42px]"
      >
        <div className="relative w-[42px] h-[42px] flex-shrink-0">
          <Image
            src="/asset/logo.svg"
            alt="Foody"
            fill
            className="object-contain"
          />
        </div>
        <span
          className={[
            "display-md-extrabold leading-[42px]",
            scrolled ? "text-neutral-950" : "text-white",
          ].join(" ")}
        >
          Foody
        </span>
      </Link>

      {/*  Right controls  */}
      {isAuthenticated ? (
        <div className="flex items-center gap-6 w-[193px] h-12">
          <Link href="/cart" className="relative flex-shrink-0 w-8 h-8">
            <ShoppingBag
              className={[
                "w-8 h-8",
                scrolled ? "text-neutral-950" : "text-white",
              ].join(" ")}
              strokeWidth={1.75}
            />
            {count > 0 && (
              <span className="absolute top-[7px] left-[18px] w-5 h-5 bg-primary rounded-[--radius-full] flex items-center justify-center text-xs-bold text-white leading-none">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-4 w-[137px] h-12">
            <div className="relative w-12 h-12 rounded-[--radius-full] overflow-hidden bg-neutral-200 flex-shrink-0">
              {user?.avatar && (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <span
              className={[
                "text-lg-semibold leading-8 tracking-[-0.02em]",
                scrolled ? "text-neutral-950" : "text-white",
              ].join(" ")}
            >
              {user?.name ?? "User"}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 h-12">
          <Link
            href="/login"
            className={[
              "flex items-center justify-center w-[163px] h-12 rounded-[--radius-full]",
              "border-2 text-md-bold transition-colors",
              scrolled
                ? "border-neutral-300 text-neutral-950 hover:bg-neutral-50"
                : "border-white       text-white        hover:bg-white/10",
            ].join(" ")}
          >
            Login
          </Link>
          <Link
            href="/register"
            className={[
              "flex items-center justify-center w-[163px] h-12 rounded-[--radius-full]",
              "text-md-bold transition-colors",
              scrolled
                ? "bg-primary text-white       hover:bg-red-700"
                : "bg-white   text-neutral-950 hover:bg-neutral-100",
            ].join(" ")}
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
}