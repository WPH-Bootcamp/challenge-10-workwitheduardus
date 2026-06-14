"use client";

import Link from "next/link";
import { useState } from "react";
import RestaurantCard from "@/components/shared/RestaurantCard";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios";
import type { Restaurant } from "@/types";
function extractList(axiosData: unknown): Restaurant[] {
  if (!axiosData) return [];

  // Already an array
  if (Array.isArray(axiosData)) return axiosData;

  if (typeof axiosData === "object") {
    const obj = axiosData as Record<string, unknown>;

    // ACTUAL shape: { success, message, data: { restaurants: [], pagination: {} } }
    if (obj.data && typeof obj.data === "object") {
      const inner = obj.data as Record<string, unknown>;

      if (Array.isArray(inner.restaurants))
        return inner.restaurants as Restaurant[];
      if (Array.isArray(inner.data)) return inner.data as Restaurant[];
      if (Array.isArray(inner.items)) return inner.items as Restaurant[];
      if (Array.isArray(inner.list)) return inner.list as Restaurant[];
      // data itself is the array
      if (Array.isArray(inner)) return inner as Restaurant[];
    }

    // Flat: { data: [] }
    if (Array.isArray(obj.data)) return obj.data as Restaurant[];

    // Flat: { restaurants: [] }
    for (const key of ["restaurants", "items", "result", "results", "list"]) {
      if (Array.isArray(obj[key])) return obj[key] as Restaurant[];
    }
  }

  console.warn(
    "[Foody] extractList — unhandled shape:",
    JSON.stringify(axiosData).slice(0, 300),
  );
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
    queryFn: async () => {
      if (categoryId) {
        const r = await api.get("/api/resto", {
          params: { category: categoryId, page, limit: PAGE_SIZE },
        });
        return extractList(r.data);
      }

      // Try best-seller first
      try {
        const r = await api.get("/api/resto/best-seller", {
          params: { page: 1, limit: PAGE_SIZE },
        });
        const items = extractList(r.data);
        if (items.length > 0) return items;
      } catch {
      }

      const r = await api.get("/api/resto", {
        params: { page, limit: PAGE_SIZE },
      });
      return extractList(r.data);
    },
    staleTime: 5 * 60 * 1000,
  });

  const hasMore = list.length >= PAGE_SIZE;

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
          href="/restaurants"
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

      {/* Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <p className="text-[16px] text-red-500 text-center py-10">
          Gagal memuat restoran. Periksa koneksi atau coba lagi.
        </p>
      )}

      {/* Cards */}
      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>

          {list.length === 0 && (
            <p className="text-[16px] text-neutral-500 text-center py-10">
              Tidak ada restoran ditemukan.
            </p>
          )}

          {hasMore && (
            <div className="flex justify-center mt-4">
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