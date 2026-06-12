"use client";

import Link from "next/link";
import { useState } from "react";
import RestaurantCard from "@/components/shared/RestaurantCard";
import { useBestSellerRestaurants, useRestaurants } from "@/lib/query/resto";
import type { GetAllRestaurantsParams } from "@/types";

//  Skeleton Card
function SkeletonCard() {
  return (
    <div className="flex flex-row items-center gap-3 p-4 h-[152px] bg-white rounded-[--radius-2xl] shadow-[0px_0px_20px_rgba(203,202,202,0.25)] animate-pulse">
      <div className="w-[120px] h-[120px] flex-shrink-0 rounded-[12px] bg-neutral-200" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-5 bg-neutral-200 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 rounded w-1/4" />
        <div className="h-4 bg-neutral-200 rounded w-1/2" />
      </div>
    </div>
  );
}

//  Props
interface RecommendedSectionProps {
  categoryId: string | null;
}

export default function RecommendedSection({
  categoryId,
}: RecommendedSectionProps) {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  // When category selected → filtered list (GET /api/resto?category=...)
  const params: GetAllRestaurantsParams = {
    category: categoryId ?? undefined,
    page,
    limit: PAGE_SIZE,
  };
  const { data: filtered = [], isLoading: loadingAll } = useRestaurants(params);

  // Default (no category) → best-seller public endpoint (no auth required)
  // GET /api/resto/best-seller
  const {
    data: bestSeller = [],
    isLoading: loadingBest,
    isError,
  } = useBestSellerRestaurants({ page: 1, limit: PAGE_SIZE });

  const rawList = categoryId ? filtered : bestSeller;
  const list = Array.isArray(rawList) ? rawList : [];
  const loading = categoryId ? loadingAll : loadingBest;
  const hasMore = list.length >= PAGE_SIZE;

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="display-md-extrabold leading-[42px] text-neutral-950">
          Recommended
        </h2>
        <Link
          href="/restaurants"
          className="text-lg-extrabold leading-8 tracking-[-0.02em] text-primary hover:text-red-700 transition-colors"
        >
          See All
        </Link>
      </div>

      {/* Error */}
      {isError && (
        <p className="text-md-regular text-accent-red text-center py-10">
          Gagal memuat restoran. Coba lagi.
        </p>
      )}

      {/* Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Cards */}
      {!loading && !isError && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>

          {list.length === 0 && (
            <p className="text-md-regular text-neutral-500 text-center py-10">
              Tidak ada restoran ditemukan.
            </p>
          )}

          {hasMore && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="w-40 h-12 border border-neutral-300 rounded-full text-md-bold text-neutral-950 hover:bg-neutral-50 transition-colors"
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