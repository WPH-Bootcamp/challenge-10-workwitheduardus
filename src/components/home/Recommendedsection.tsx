"use client";

import Link from "next/link";
import { useState } from "react";
import RestaurantCard from "@/components/shared/RestaurantCard";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios";
import type { Restaurant } from "@/types";

function extractList(raw: unknown): Restaurant[] {
  if (!raw || typeof raw !== "object") return [];
  if (Array.isArray(raw)) return raw as Restaurant[];
  const o = raw as Record<string, unknown>;

  if (o.data && typeof o.data === "object") {
    const d = o.data as Record<string, unknown>;
    if (Array.isArray(d.restaurants)) return d.restaurants as Restaurant[];
    if (Array.isArray(d.data)) return d.data as Restaurant[];
    if (Array.isArray(d.items)) return d.items as Restaurant[];
  }
  if (Array.isArray(o.data)) return o.data as Restaurant[];
  return [];
}

function SkeletonCard() {
  return (
    <div className="flex flex-row items-center gap-3 p-4 h-[152px] bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] animate-pulse">
      <div className="w-[120px] h-[120px] flex-shrink-0 rounded-xl bg-neutral-200" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-5 bg-neutral-200 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 rounded w-1/4" />
        <div className="h-4 bg-neutral-200 rounded w-1/2" />
      </div>
    </div>
  );
}

interface RecommendedSectionProps {
  categoryId: string | null;
}

async function fetchByCategory(
  categoryId: string | null,
  page: number,
  limit: number,
): Promise<Restaurant[]> {
  if (!categoryId || categoryId === "all") {
    try {
      const r = await api.get("/api/resto/best-seller", {
        params: { page: 1, limit },
      });
      const items = extractList(r.data);
      if (items.length > 0) return items;
    } catch {
    }

    const r = await api.get("/api/resto", { params: { page, limit } });
    return extractList(r.data);
  }

  if (categoryId === "bestseller") {
    const r = await api.get("/api/resto/best-seller", {
      params: { page, limit },
    });
    return extractList(r.data);
  }

  if (categoryId === "nearby") {
    try {
      const r = await api.get("/api/resto/nearby", { params: { limit } });
      const items = extractList(r.data);
      if (items.length > 0) return items;
    } catch {
    }
    return [];
  }

  const categoryNames: Record<string, string> = {
    lunch: "Lunch",
    discount: "Discount",
    delivery: "Delivery",
  };
  const catName = categoryNames[categoryId] ?? categoryId;

  try {
    const r = await api.get("/api/resto", {
      params: { category: catName, page, limit },
    });
    const items = extractList(r.data);
    if (items.length > 0) return items;

    const r2 = await api.get("/api/resto", {
      params: { category: catName.toLowerCase(), page, limit },
    });
    return extractList(r2.data);
  } catch {
    return [];
  }
}

export default function RecommendedSection({
  categoryId,
}: RecommendedSectionProps) {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  const {
    data: list = [],
    isLoading,
    isError,
  } = useQuery<Restaurant[]>({
    queryKey: ["resto-section", categoryId, page],
    queryFn: () => fetchByCategory(categoryId, page, PAGE_SIZE),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  const safeList = Array.isArray(list) ? list : [];
  const hasMore = safeList.length >= PAGE_SIZE;

  return (
    <div className="flex flex-col gap-6 lg:gap-8 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          style={{ fontSize: "32px", fontWeight: 800, lineHeight: "42px" }}
          className="text-neutral-950"
        >
          Recommended
        </h2>
        <Link
          href="/category"
          style={{
            fontSize: "18px",
            fontWeight: 800,
            lineHeight: "32px",
            letterSpacing: "-0.02em",
          }}
          className="text-primary hover:text-red-700 transition-colors"
        >
          See All
        </Link>
      </div>

      {/* Skeletons while loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Cards */}
      {!isLoading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {safeList.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>

          {safeList.length === 0 && (
            <p className="text-[14px] text-neutral-500 text-center py-8">
              {categoryId === "nearby"
                ? "Login terlebih dahulu untuk melihat restoran terdekat."
                : "Tidak ada restoran ditemukan."}
            </p>
          )}

          {hasMore && (
            <div className="flex justify-center mt-2">
              <button
                onClick={() => setPage((p) => p + 1)}
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
                className="w-[160px] h-12 border border-[#D5D7DA] rounded-full text-neutral-950 hover:bg-neutral-50 transition-colors"
              >
                Show More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
