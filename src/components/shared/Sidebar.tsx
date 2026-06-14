"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, ClipboardList, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const NAV = [
  { label: "Delivery Address", icon: MapPin, href: "/profile" },
  { label: "My Orders", icon: ClipboardList, href: "/orders" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  return (
    <aside className="w-full lg:w-[240px] flex-shrink-0">
      <div className="bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] overflow-hidden">
        {/* User info — matches Figma profile card top */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-neutral-100">
          <div className="relative w-[44px] h-[44px] rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name ?? "User"}
                fill
                sizes="44px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <Image
                src="/John-doe.svg"
                alt={user?.name ?? "User"}
                fill
                sizes="44px"
                className="object-cover"
                unoptimized
              />
            )}
            {/* initials fallback */}
            <div className="absolute inset-0 flex items-center justify-center bg-primary -z-10">
              <span className="text-white font-bold">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <p
              style={{ fontSize: "14px", fontWeight: 700 }}
              className="text-neutral-950 truncate"
            >
              {user?.name ?? "User"}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col py-2">
          {NAV.map(({ label, icon: Icon, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "flex items-center gap-3 px-5 py-3.5 transition-colors",
                  active
                    ? "bg-primary/5 text-primary border-l-2 border-primary"
                    : "text-neutral-700 hover:bg-neutral-50",
                ].join(" ")}
              >
                <Icon
                  size={16}
                  className={active ? "text-primary" : "text-neutral-500"}
                />
                <span
                  style={{ fontSize: "14px", fontWeight: active ? 700 : 500 }}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-3.5 text-neutral-700 hover:bg-red-50 hover:text-primary transition-colors w-full"
          >
            <LogOut size={16} className="text-neutral-500" />
            <span style={{ fontSize: "14px", fontWeight: 500 }}>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
