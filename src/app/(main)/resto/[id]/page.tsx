"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, MapPin, Share2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api/axios";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { useAuthStore } from "@/store/authStore";

// ─── Types 
interface RestoDetail {
  id: string;
  name: string;
  logo?: string;
  images?: string[];
  image?: string;
  star?: number;
  rating?: number;
  averageRating?: number;
  place?: string;
  location?: string;
  distance?: string;
  reviewCount?: number;
  menus?: MenuItem[];
  reviews?: ReviewItem[];
}

interface MenuItem {
  id: string;
  name?: string;
  menuName?: string;
  price: number;
  image?: string;
  category?: string;
}

interface ReviewItem {
  id: string;
  userName?: string;
  userAvatar?: string;
  star?: number;
  rating?: number;
  comment?: string;
  createdAt?: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

function StarRow({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(value ?? 0)
              ? "fill-[#FFAB0D] text-[#FFAB0D]"
              : "text-neutral-300"
          }
        />
      ))}
    </div>
  );
}

const TABS = ["All Menu", "Food", "Drink"];

// ─── Menu Card 
function MenuCard({
  item,
  qty,
  onAdd,
  onMinus,
}: {
  item: MenuItem;
  qty: number;
  onAdd: () => void;
  onMinus: () => void;
}) {
  const itemName = item.name ?? item.menuName ?? "—";

  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0px_0px_20px_rgba(203,202,202,0.25)]">
      <div
        className="relative w-full bg-neutral-100"
        style={{ height: "130px" }}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={itemName}
            fill
            sizes="(max-width:1024px) 50vw, 25vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
            <span className="text-neutral-400 text-xs">No image</span>
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2">
        <p
          style={{
            fontSize: "13px",
            fontWeight: 700,
            lineHeight: "18px",
            letterSpacing: "-0.02em",
          }}
          className="text-neutral-950 line-clamp-2 min-h-[36px]"
        >
          {itemName}
        </p>
        <p
          style={{ fontSize: "13px", fontWeight: 600 }}
          className="text-primary"
        >
          {fmt(item.price)}
        </p>
        {qty === 0 ? (
          <button
            onClick={onAdd}
            className="w-full h-8 bg-[#C12116] rounded-full flex items-center justify-center gap-1 hover:bg-red-700 transition-colors"
          >
            <Plus size={12} className="text-white" strokeWidth={3} />
            <span
              style={{ fontSize: "12px", fontWeight: 700 }}
              className="text-white"
            >
              Add
            </span>
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <button
              onClick={onMinus}
              className="w-7 h-7 rounded-full border border-[#D5D7DA] flex items-center justify-center hover:border-primary transition-colors"
            >
              <Minus size={12} className="text-neutral-700" strokeWidth={2.5} />
            </button>
            <span
              style={{ fontSize: "14px", fontWeight: 700 }}
              className="text-neutral-950"
            >
              {qty}
            </span>
            <button
              onClick={onAdd}
              className="w-7 h-7 rounded-full bg-[#C12116] flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              <Plus size={12} className="text-white" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page 
export default function RestoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("All Menu");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [reviewPage, setReviewPage] = useState(1);

  const { data: rawResto, isLoading: loadingResto } = useQuery({
    queryKey: ["resto-detail", id],
    queryFn: async () => {
      const r = await api.get(`/api/resto/${id}`);
      return r.data;
    },
    enabled: !!id,
  });

  const restoData = (rawResto?.data ?? rawResto) as RestoDetail | null;

  const allMenuItems: MenuItem[] = Array.isArray(restoData?.menus)
    ? restoData.menus
    : [];

  const menuItems =
    activeTab === "All Menu"
      ? allMenuItems
      : allMenuItems.filter((item) => {
          const cat = (item.category ?? "").toLowerCase();
          if (activeTab === "Drink")
            return cat === "drink" || cat === "minuman" || cat === "beverage";
          if (activeTab === "Food")
            return cat !== "drink" && cat !== "minuman" && cat !== "beverage";
          return true;
        });

  const { data: rawReviews } = useQuery({
    queryKey: ["reviews", id, reviewPage],
    queryFn: async () => {
      const endpoints = [
        { url: `/api/review/${id}`, params: { page: reviewPage, limit: 6 } },
        {
          url: "/api/review",
          params: { restoId: id, page: reviewPage, limit: 6 },
        },
        {
          url: "/api/review",
          params: { restaurantId: id, page: reviewPage, limit: 6 },
        },
        {
          url: `/api/resto/${id}/review`,
          params: { page: reviewPage, limit: 6 },
        },
      ];
      for (const ep of endpoints) {
        try {
          const r = await api.get(ep.url, { params: ep.params });
          if (r.data?.success !== false) return r.data;
        } catch {
          /* try next */
        }
      }
      return null;
    },
    enabled: !!id && isAuthenticated,
    retry: false,
  });

  const reviews: ReviewItem[] = (() => {
    if (Array.isArray(restoData?.reviews)) return restoData.reviews;
    if (!rawReviews) return [];
    if (Array.isArray(rawReviews)) return rawReviews;
    const d = rawReviews?.data ?? rawReviews;
    if (!d || typeof d !== "object") return [];
    const o = d as Record<string, unknown>;
    for (const k of ["reviews", "review", "items", "data", "list"]) {
      if (Array.isArray(o[k])) return o[k] as ReviewItem[];
    }
    return [];
  })();

  const { mutate: addToCartMutation } = useMutation({
    mutationFn: (payload: {
      menuId: string;
      restaurantId: string;
      quantity: number;
    }) => api.post("/api/cart", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      console.log("[DETAIL] Item added to cart, invalidated cache");
    },
    onError: (error: Error) => {
      console.error("[DETAIL] Add to cart error:", error.message);
    },
  });

  const handleAdd = (item: MenuItem) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    const newQty = (quantities[item.id] ?? 0) + 1;
    setQuantities((prev) => ({ ...prev, [item.id]: newQty }));
    console.log("[DETAIL] Adding to cart:", {
      menuId: item.id,
      name: item.name ?? item.menuName,
      restaurantId: id,
      quantity: newQty,
    });
    addToCartMutation({ menuId: item.id, restaurantId: id, quantity: newQty });
  };

  const handleMinus = (item: MenuItem) => {
    const newQty = Math.max(0, (quantities[item.id] ?? 0) - 1);
    setQuantities((prev) => ({ ...prev, [item.id]: newQty }));
    if (newQty > 0)
      addToCartMutation({
        menuId: item.id,
        restaurantId: id,
        quantity: newQty,
      });
  };

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(quantities).reduce((sum, [menuId, qty]) => {
    const item = allMenuItems.find((m) => m.id === menuId);
    return sum + (item?.price ?? 0) * qty;
  }, 0);

  const ratingVal = Number(
    restoData?.averageRating ?? restoData?.star ?? restoData?.rating ?? 0,
  );
  const imgMain =
    restoData?.images?.[0] || restoData?.logo || restoData?.image || "";
  const imgSm1 = restoData?.images?.[1] || "";
  const imgSm2 = restoData?.images?.[2] || "";

  if (loadingResto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header scrolled />
      </div>
      <div className="h-16 lg:h-20 flex-shrink-0" />

      <div
        className="w-full grid grid-cols-2 gap-1 flex-shrink-0"
        style={{ height: "280px" }}
      >
        <div
          className="relative bg-neutral-200 overflow-hidden"
          style={{ height: "280px" }}
        >
          {imgMain ? (
            <Image
              src={imgMain}
              alt={restoData?.name ?? "Restaurant"}
              fill
              sizes="50vw"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-neutral-300" />
          )}
        </div>
        <div className="grid grid-rows-2 gap-1" style={{ height: "280px" }}>
          {[imgSm1, imgSm2].map((src, i) => (
            <div key={i} className="relative bg-neutral-300 overflow-hidden">
              {src ? (
                <Image
                  src={src}
                  alt={`${restoData?.name ?? ""} photo ${i + 2}`}
                  fill
                  sizes="25vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-neutral-200" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 lg:px-[120px] py-5 flex items-start justify-between gap-4 border-b border-neutral-100">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="relative w-[56px] h-[56px] lg:w-[72px] lg:h-[72px] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 flex-shrink-0">
            {restoData?.logo || restoData?.image ? (
              <Image
                src={restoData.logo || restoData.image || ""}
                alt={restoData?.name ?? ""}
                fill
                sizes="72px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-neutral-200" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <h1
              style={{
                fontSize: "20px",
                fontWeight: 800,
                lineHeight: "28px",
                letterSpacing: "-0.02em",
              }}
              className="text-neutral-950"
            >
              {restoData?.name ?? "—"}
            </h1>
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-[#FFAB0D] text-[#FFAB0D]" />
              <span
                style={{ fontSize: "13px", fontWeight: 500 }}
                className="text-neutral-950"
              >
                {ratingVal}
              </span>
              {restoData?.reviewCount != null && (
                <span style={{ fontSize: "12px" }} className="text-neutral-400">
                  ({restoData.reviewCount} Ulasan)
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-neutral-400" />
              <span
                style={{ fontSize: "12px", letterSpacing: "-0.02em" }}
                className="text-neutral-600"
              >
                {restoData?.place ?? restoData?.location ?? "—"}
                {restoData?.distance ? ` · ${restoData.distance}` : ""}
              </span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-1 text-neutral-500 hover:text-neutral-700 mt-1 flex-shrink-0">
          <Share2 size={15} />
          <span style={{ fontSize: "12px", fontWeight: 500 }}>Share</span>
        </button>
      </div>

      <div className="px-4 lg:px-[120px] py-6 flex flex-col gap-5">
        <h2
          style={{ fontSize: "22px", fontWeight: 800, lineHeight: "30px" }}
          className="text-neutral-950"
        >
          Menu
        </h2>
        <div className="flex items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontSize: "13px",
                fontWeight: activeTab === tab ? 700 : 500,
              }}
              className={[
                "px-4 h-9 rounded-full transition-colors flex-shrink-0",
                activeTab === tab
                  ? "bg-[#C12116] text-white"
                  : "border border-[#D5D7DA] text-neutral-600 hover:border-primary hover:text-primary",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>

        {menuItems.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {menuItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  qty={quantities[item.id] ?? 0}
                  onAdd={() => handleAdd(item)}
                  onMinus={() => handleMinus(item)}
                />
              ))}
            </div>
            {allMenuItems.length > 8 && activeTab === "All Menu" && (
              <div className="flex justify-center mt-2">
                <button
                  style={{ fontSize: "14px", fontWeight: 700 }}
                  className="w-[140px] h-10 border border-neutral-300 rounded-full text-neutral-950 hover:bg-neutral-50"
                >
                  Show More
                </button>
              </div>
            )}
          </>
        ) : (
          <p
            style={{ fontSize: "14px" }}
            className="text-neutral-400 text-center py-8"
          >
            Tidak ada menu tersedia.
          </p>
        )}
      </div>

      <div className="px-4 lg:px-[120px] pb-8 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2
            style={{ fontSize: "22px", fontWeight: 800, lineHeight: "30px" }}
            className="text-neutral-950"
          >
            Review
          </h2>
          {ratingVal > 0 && (
            <div className="flex items-center gap-2">
              <StarRow value={ratingVal} size={14} />
              <span
                style={{ fontSize: "13px", fontWeight: 700 }}
                className="text-neutral-950"
              >
                {ratingVal} ({restoData?.reviewCount ?? 0} Ulasan)
              </span>
            </div>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <p
              style={{ fontSize: "14px" }}
              className="text-neutral-500 text-center"
            >
              Login untuk melihat ulasan
            </p>
            <Link
              href="/login"
              className="px-6 h-10 bg-primary rounded-full text-white font-bold text-[14px] flex items-center hover:bg-red-700 transition-colors"
            >
              Login
            </Link>
          </div>
        ) : reviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {reviews.map((rv, idx) => (
                <div
                  key={rv.id ?? idx}
                  className="flex flex-col gap-3 p-4 border border-neutral-200 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                      {rv.userAvatar ? (
                        <Image
                          src={rv.userAvatar}
                          alt={rv.userName ?? "User"}
                          fill
                          sizes="40px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-primary flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {rv.userName?.[0]?.toUpperCase() ?? "U"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p
                        style={{ fontSize: "14px", fontWeight: 700 }}
                        className="text-neutral-950"
                      >
                        {rv.userName ?? "Anonymous"}
                      </p>
                      {rv.createdAt && (
                        <p
                          style={{ fontSize: "11px" }}
                          className="text-neutral-400"
                        >
                          {new Date(rv.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  <StarRow
                    value={Number(rv.star ?? rv.rating ?? 0)}
                    size={13}
                  />
                  <p
                    style={{ fontSize: "13px", lineHeight: "22px" }}
                    className="text-neutral-700"
                  >
                    {rv.comment}
                  </p>
                </div>
              ))}
            </div>
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
          </>
        ) : (
          <p
            style={{ fontSize: "14px" }}
            className="text-neutral-400 text-center py-4"
          >
            Belum ada ulasan.
          </p>
        )}
      </div>

      <Footer />

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 lg:px-[120px] pb-5 pointer-events-none">
          <Link
            href="/cart"
            className="pointer-events-auto flex items-center justify-between w-full max-w-[560px] mx-auto h-14 bg-[#C12116] rounded-full px-6 shadow-xl hover:bg-red-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-white" />
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
              {fmt(totalPrice)} →
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
