"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import RestaurantCard from "@/components/shared/RestaurantCard";
import api from "@/lib/api/axios";
import type { Restaurant } from "@/types";

const CATEGORIES = [
  "All Restaurant",
  "Nearby",
  "Discount",
  "Best Seller",
  "Delivery",
  "Lunch",
];

const RATINGS = ["All Rating", "4.5+", "4.0+", "3.5+"];

function extractList(raw: unknown): Restaurant[] {
  if (!raw || typeof raw !== "object") return [];
  if (Array.isArray(raw)) return raw;
  const o = raw as Record<string, unknown>;
  if (o.data && typeof o.data === "object") {
    const d = o.data as Record<string, unknown>;
    if (Array.isArray(d.restaurants)) return d.restaurants as Restaurant[];
  }
  return [];
}

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const [scrolled] = useState(false);

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(
    searchParams.get("category") ?? "All Restaurant",
  );
  const [rating, setRating] = useState("All Rating");
  const [showFilter, setShowFilter] = useState(false);

  const { data: restaurants = [], isLoading } = useQuery<Restaurant[]>({
    queryKey: ["category", category, search, rating],
    queryFn: async () => {
      const params: Record<string, unknown> = { limit: 20 };
      if (search) params.search = search;
      if (category !== "All Restaurant")
        params.category = category.toLowerCase().replace(" ", "_");
      if (rating !== "All Rating") params.rating = parseFloat(rating);

      const endpoint = search ? "/api/resto/search" : "/api/resto";
      if (search) params.q = search;
      const r = await api.get(endpoint, { params });
      return extractList(r.data);
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header scrolled={scrolled} />
      </div>

      <main className="flex-1 pt-24 pb-16 px-4 lg:px-[120px]">
        {/* Search + Filter header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 h-12 px-4 bg-white rounded-full shadow-[0px_0px_20px_rgba(203,202,202,0.25)]">
            <Search size={18} className="text-neutral-500 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search restaurants, food and drink"
              className="flex-1 text-[14px] text-neutral-950 placeholder:text-neutral-500 bg-transparent outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={16} className="text-neutral-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilter((p) => !p)}
            className={[
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors flex-shrink-0",
              showFilter
                ? "bg-primary text-white"
                : "bg-white text-neutral-700 shadow-[0px_0px_20px_rgba(203,202,202,0.25)]",
            ].join(" ")}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Category pills */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-2 mb-4"
          style={{ scrollbarWidth: "none" }}
        >
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                fontSize: "13px",
                fontWeight: category === c ? 700 : 500,
              }}
              className={[
                "px-4 h-9 rounded-full flex-shrink-0 transition-colors",
                category === c
                  ? "bg-primary text-white"
                  : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400",
              ].join(" ")}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Filter panel */}
        {showFilter && (
          <div className="bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] p-5 mb-4 flex flex-col gap-4">
            <div>
              <p
                style={{ fontSize: "13px", fontWeight: 700 }}
                className="text-neutral-700 mb-2"
              >
                Rating
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {RATINGS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    style={{
                      fontSize: "13px",
                      fontWeight: rating === r ? 700 : 500,
                    }}
                    className={[
                      "px-3 h-8 rounded-full transition-colors",
                      rating === r
                        ? "bg-primary text-white"
                        : "border border-neutral-200 text-neutral-600 hover:border-primary",
                    ].join(" ")}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Page title */}
        <div className="flex items-center justify-between mb-4">
          <h1
            style={{ fontSize: "20px", fontWeight: 800 }}
            className="text-neutral-950"
          >
            {category}
          </h1>
          <span style={{ fontSize: "13px" }} className="text-neutral-500">
            {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[152px] bg-white rounded-2xl animate-pulse shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
              />
            ))}
          </div>
        )}

        {/* Restaurant grid */}
        {!isLoading && restaurants.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}

        {!isLoading && restaurants.length === 0 && (
          <p
            style={{ fontSize: "14px" }}
            className="text-neutral-500 text-center py-16"
          >
            Tidak ada restoran ditemukan untuk "{search || category}".
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
