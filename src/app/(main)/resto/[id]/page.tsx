"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, MapPin, Share2, Plus, Minus, ShoppingBag } from "lucide-react";
import api from "@/lib/api/axios";
import type { Restaurant } from "@/types";

// ─── Types ───────────────────────────────────────────────────────────────────
interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function extractData(raw: unknown, key: string): unknown[] {
  if (!raw || typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;
  // { data: { [key]: [] } }
  if (obj.data && typeof obj.data === "object") {
    const inner = obj.data as Record<string, unknown>;
    if (Array.isArray(inner[key])) return inner[key] as unknown[];
    if (Array.isArray(inner)) return inner as unknown[];
    if (Array.isArray(inner.data)) return inner.data as unknown[];
  }
  if (Array.isArray(obj[key])) return obj[key] as unknown[];
  if (Array.isArray(obj.data)) return obj.data as unknown[];
  return [];
}

function extractSingle(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
    const inner = obj.data as Record<string, unknown>;
    if (inner.restaurant) return inner.restaurant as Record<string, unknown>;
    return inner;
  }
  return obj;
}

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

// ─── Star Rating ─────────────────────────────────────────────────────────────
function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={
            i <= Math.round(value)
              ? "text-[#FFAB0D] fill-[#FFAB0D]"
              : "text-neutral-300"
          }
        />
      ))}
    </div>
  );
}

// ─── Menu Tab Bar ─────────────────────────────────────────────────────────────
const TABS = ["All Menu", "Food", "Drink"];

// ─── Page ────────────────────────────────────────────────────────────────────
export default function RestoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const [activeTab, setActiveTab] = useState("All Menu");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [reviewPage, setReviewPage] = useState(1);

  // ── Fetch restaurant detail ───────────────────────────────────────────────
  const { data: resto, isLoading: loadingResto } = useQuery({
    queryKey: ["resto", id],
    queryFn: async () => {
      const r = await api.get(`/api/resto/${id}`);
      return extractSingle(r.data) as unknown as Restaurant;
    },
    enabled: !!id,
  });

  // ── Fetch menu ─────────────────────────────────────────────────────────────
  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["menu", id, activeTab],
    queryFn: async () => {
      const params: Record<string, unknown> = { restoId: id };
      if (activeTab !== "All Menu") params.category = activeTab.toLowerCase();
      const r = await api.get(`/api/resto/${id}/menu`, { params });
      return extractData(r.data, "menus") as MenuItem[];
    },
    enabled: !!id,
  });

  // ── Fetch reviews ─────────────────────────────────────────────────────────
  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["reviews", id, reviewPage],
    queryFn: async () => {
      const r = await api.get("/api/review", {
        params: { restoId: id, page: reviewPage, limit: 6 },
      });
      return extractData(r.data, "reviews") as Review[];
    },
    enabled: !!id,
  });

  // ── Add to cart ────────────────────────────────────────────────────────────
  const { mutate: addToCart } = useMutation({
    mutationFn: (item: { menuId: string; quantity: number }) =>
      api.post("/api/cart", item),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  const changeQty = (menuId: string, delta: number) => {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[menuId] ?? 0) + delta);
      return { ...prev, [menuId]: next };
    });
  };

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);

  if (loadingResto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* ── Hero images ──────────────────────────────────────────────────────
          Figma: grid of images at top, main image left + 2 smaller right
      */}
      <div className="w-full h-[300px] lg:h-[400px] grid grid-cols-2 gap-1 overflow-hidden">
        {/* Main large image */}
        <div className="relative bg-neutral-200">
          {resto?.image ? (
            <Image
              src={resto.image}
              alt={resto.name ?? ""}
              fill
              sizes="50vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-200" />
          )}
        </div>
        {/* 2 smaller images stacked */}
        <div className="grid grid-rows-2 gap-1">
          {[0, 1].map((i) => (
            <div key={i} className="relative bg-neutral-300">
              {resto?.images?.[i] ? (
                <Image
                  src={(resto.images as string[])[i]}
                  alt={`${resto.name} ${i + 1}`}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-neutral-300" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full px-4 lg:px-[120px] pt-6 flex flex-col gap-6">
        {/* ── Restaurant info ─────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="relative w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
              {resto?.logo ? (
                <Image
                  src={resto.logo as string}
                  alt={resto.name ?? ""}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400 text-xs">
                  Logo
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  lineHeight: "32px",
                  letterSpacing: "-0.02em",
                }}
                className="text-neutral-950"
              >
                {resto?.name ?? "—"}
              </h1>
              {/* Rating row */}
              <div className="flex items-center gap-1">
                <Star size={16} className="text-[#FFAB0D] fill-[#FFAB0D]" />
                <span
                  style={{ fontSize: "16px", fontWeight: 500 }}
                  className="text-neutral-950"
                >
                  {resto?.star ?? resto?.rating ?? "—"}
                </span>
                {resto?.reviewCount && (
                  <span className="text-neutral-500 text-[14px]">
                    ({resto.reviewCount as number} Ulasan)
                  </span>
                )}
              </div>
              {/* Location row */}
              <div className="flex items-center gap-1.5 text-neutral-950">
                <MapPin size={14} className="text-neutral-500 flex-shrink-0" />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {resto?.place ?? "—"}
                </span>
                {resto?.distance && (
                  <>
                    <span className="w-1 h-1 bg-neutral-950 rounded-full flex-shrink-0" />
                    <span style={{ fontSize: "14px" }}>
                      {resto.distance as string}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Share button */}
          <button className="flex items-center gap-2 text-neutral-500 hover:text-neutral-700 transition-colors flex-shrink-0">
            <Share2 size={18} />
            <span style={{ fontSize: "14px", fontWeight: 500 }}>Share</span>
          </button>
        </div>

        {/* ── Menu section ────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <h2
            style={{ fontSize: "24px", fontWeight: 800, lineHeight: "32px" }}
            className="text-neutral-950"
          >
            Menu
          </h2>

          {/* Tab bar — All Menu / Food / Drink */}
          <div className="flex items-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontSize: "14px",
                  fontWeight: activeTab === tab ? 700 : 500,
                }}
                className={[
                  "px-4 h-9 rounded-full transition-colors flex-shrink-0",
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "border border-neutral-300 text-neutral-600 hover:border-primary hover:text-primary",
                ].join(" ")}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Menu grid — 4 cols desktop, 2 cols mobile */}
          {menuItems.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {menuItems.map((item) => {
                const qty = quantities[item.id] ?? 0;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
                  >
                    {/* Food image */}
                    <div className="relative w-full h-[120px] lg:h-[140px] bg-neutral-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width:1024px) 50vw, 25vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-200" />
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-3 flex flex-col gap-2">
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          letterSpacing: "-0.02em",
                        }}
                        className="text-neutral-950 line-clamp-1"
                      >
                        {item.name}
                      </span>
                      <span
                        style={{ fontSize: "14px", fontWeight: 600 }}
                        className="text-primary"
                      >
                        {formatRupiah(item.price)}
                      </span>
                      {/* Qty controls */}
                      <div className="flex items-center justify-between gap-2">
                        {qty === 0 ? (
                          <button
                            onClick={() => changeQty(item.id, 1)}
                            className="w-full h-8 bg-primary rounded-full flex items-center justify-center gap-1 hover:bg-red-700 transition-colors"
                          >
                            <Plus size={14} className="text-white" />
                            <span
                              style={{ fontSize: "12px", fontWeight: 700 }}
                              className="text-white"
                            >
                              Add
                            </span>
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => {
                                changeQty(item.id, -1);
                                if (qty === 1) return; // going to 0 removes from cart UI
                              }}
                              className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center hover:border-primary transition-colors"
                            >
                              <Minus size={12} className="text-neutral-700" />
                            </button>
                            <span
                              style={{ fontSize: "14px", fontWeight: 700 }}
                              className="text-neutral-950"
                            >
                              {qty}
                            </span>
                            <button
                              onClick={() => changeQty(item.id, 1)}
                              className="w-7 h-7 rounded-full bg-primary flex items-center justify-center hover:bg-red-700 transition-colors"
                            >
                              <Plus size={12} className="text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-neutral-500 text-[14px] py-8 text-center">
              Tidak ada menu tersedia.
            </p>
          )}

          {menuItems.length >= 8 && (
            <div className="flex justify-center">
              <button
                style={{ fontSize: "14px", fontWeight: 700 }}
                className="w-[140px] h-10 border border-neutral-300 rounded-full text-neutral-950 hover:bg-neutral-50"
              >
                Show More
              </button>
            </div>
          )}
        </div>

        {/* ── Review section ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2
              style={{ fontSize: "24px", fontWeight: 800, lineHeight: "32px" }}
              className="text-neutral-950"
            >
              Review
            </h2>
            {resto?.star && (
              <div className="flex items-center gap-1">
                <StarRating value={Number(resto.star ?? resto.rating ?? 0)} />
                <span
                  style={{ fontSize: "14px", fontWeight: 700 }}
                  className="text-neutral-950 ml-1"
                >
                  {resto.star ?? resto.rating} (
                  {(resto.reviewCount as number) ?? 0} Ulasan)
                </span>
              </div>
            )}
          </div>

          {/* Review cards — 2 col desktop */}
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {reviews.map((rv) => (
                <div
                  key={rv.id}
                  className="flex flex-col gap-3 p-4 border border-neutral-200 rounded-2xl"
                >
                  {/* Reviewer info */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0">
                      {rv.userAvatar ? (
                        <Image
                          src={rv.userAvatar}
                          alt={rv.userName}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-300 flex items-center justify-center text-neutral-500 text-xs font-bold">
                          {rv.userName?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span
                        style={{ fontSize: "14px", fontWeight: 700 }}
                        className="text-neutral-950"
                      >
                        {rv.userName}
                      </span>
                      <span
                        style={{ fontSize: "12px", fontWeight: 400 }}
                        className="text-neutral-500"
                      >
                        {new Date(rv.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <StarRating value={rv.rating} />
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "24px",
                    }}
                    className="text-neutral-700"
                  >
                    {rv.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-[14px] py-4 text-center">
              Belum ada ulasan.
            </p>
          )}

          {reviews.length >= 6 && (
            <div className="flex justify-center">
              <button
                onClick={() => setReviewPage((p) => p + 1)}
                style={{ fontSize: "14px", fontWeight: 700 }}
                className="w-[140px] h-10 border border-neutral-300 rounded-full text-neutral-950 hover:bg-neutral-50"
              >
                Show More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Floating checkout bar ─────────────────────────────────────────────
          Shows when items are in cart
      */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 lg:px-[120px] pb-6 pointer-events-none">
          <Link
            href="/cart"
            className="pointer-events-auto flex items-center justify-between w-full max-w-[600px] mx-auto h-14 bg-primary rounded-full px-6 shadow-xl hover:bg-red-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-white" />
              <span
                style={{ fontSize: "14px", fontWeight: 700 }}
                className="text-white"
              >
                {totalItems} item{totalItems > 1 ? "s" : ""}
              </span>
            </div>
            <span
              style={{ fontSize: "14px", fontWeight: 700 }}
              className="text-white"
            >
              Checkout →
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
