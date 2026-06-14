"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, ShoppingBag, ClipboardList, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const NAV = [
  { label: "Delivery Address", icon: MapPin, href: "/profile" },
  { label: "My Orders", icon: ClipboardList, href: "/orders" },
  { label: "My Cart", icon: ShoppingBag, href: "/cart" },
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
    <aside className="w-full lg:w-[260px] flex-shrink-0">
      <div className="bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] p-6 flex flex-col gap-6">
        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                sizes="48px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </span>
              </div>
            )}
          </div>
          <div>
            <p
              style={{ fontSize: "16px", fontWeight: 700 }}
              className="text-neutral-950"
            >
              {user?.name ?? "User"}
            </p>
            <p style={{ fontSize: "12px" }} className="text-neutral-500">
              {user?.email ?? ""}
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-neutral-200" />

        {/* Nav links */}
        <nav className="flex flex-col gap-1">
          {NAV.map(({ label, icon: Icon, href }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-neutral-700 hover:bg-neutral-50",
                ].join(" ")}
              >
                <Icon
                  size={18}
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
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 hover:bg-red-50 hover:text-primary transition-colors w-full"
          >
            <LogOut size={18} className="text-neutral-500" />
            <span style={{ fontSize: "14px", fontWeight: 500 }}>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
