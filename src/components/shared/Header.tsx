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
        "w-full h-16 lg:h-20 flex items-center justify-between px-4 lg:px-[120px] transition-all duration-300",
        scrolled
          ? "bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
          : "bg-transparent",
      ].join(" ")}
    >
      <Link
        href="/"
        className="flex items-center gap-[15px] w-[149px] h-[42px] flex-shrink-0"
      >
        <div className="relative w-[42px] h-[42px] flex-shrink-0">
          <Image
            src={scrolled ? "/Logo-red.svg" : "/Logo-white.svg"}
            alt="Foody"
            fill
            sizes="42px"
            className="object-contain"
          />
        </div>
        <span
          style={{ fontSize: "32px", fontWeight: 800, lineHeight: "42px" }}
          className={scrolled ? "text-[#0A0D12]" : "text-[#FDFDFD]"}
        >
          Foody
        </span>
      </Link>

      {/*  Right controls  */}
      {isAuthenticated ? (
        <div className="flex items-center gap-6 w-[193px] h-12">
          <Link href="/cart" className="relative flex-shrink-0 w-8 h-8">
            <ShoppingBag
              size={28}
              strokeWidth={1.75}
              className={scrolled ? "text-neutral-950" : "text-white"}
            />
            {count > 0 && (
              <span className="absolute top-[7px] left-[18px] w-5 h-5 bg-[#C12116] rounded-full flex items-center justify-center text-[12px] font-bold leading-none text-white">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-3 flex-shrink-0"
          >
            <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
              <Image
                src={user?.avatar || "/John-doe.svg"}
                alt={user?.name ?? "User"}
                fill
                sizes="48px"
                className="object-cover"
                unoptimized
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-primary">
                <span className="text-white font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </span>
              </div>
            </div>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "32px",
                letterSpacing: "-0.02em",
              }}
              className={[
                "hidden lg:block",
                scrolled ? "text-[#0A0D12]" : "text-white",
              ].join(" ")}
            >
              {user?.name ?? "User"}
            </span>
          </Link>
        </div>
      ) : (
        /* BEFORE LOGIN: */
        <div className="flex items-center gap-3 lg:gap-4">
          <Link
            href="/login"
            style={{
              width: "163px",
              height: "48px",
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: "30px",
              letterSpacing: "-0.02em",
            }}
            className={[
              "hidden sm:flex items-center justify-center rounded-[100px] transition-colors",
              scrolled
                ? "border-2 border-[#D5D7DA] text-[#0A0D12] hover:bg-neutral-50"
                : "border-2 border-[#D5D7DA] text-white       hover:bg-white/10",
            ].join(" ")}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            style={{
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: "30px",
              letterSpacing: "-0.02em",
            }}
            className={[
              "flex items-center justify-center px-6 sm:px-0 sm:w-[163px] h-12 rounded-[100px] transition-colors",
              scrolled
                ? "bg-[#C12116] text-white     hover:bg-red-700"
                : "bg-white     text-[#0A0D12] hover:bg-neutral-100",
            ].join(" ")}
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
}