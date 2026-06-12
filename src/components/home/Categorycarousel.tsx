"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CategoryCard from "@/components/shared/CategoryCard";
import type { Category } from "@/types";

const CATEGORIES: Category[] = [
  { id: "all", label: "All Restaurant", icon: "/All-Restaurant.svg" },
  { id: "nearby", label: "Nearby", icon: "/Location.svg" },
  { id: "discount", label: "Discount", icon: "/Discount.svg" },
  { id: "bestseller", label: "Best Seller", icon: "/Best-Seller.svg" },
  { id: "delivery", label: "Delivery", icon: "/Delivery.svg" },
  { id: "lunch", label: "Lunch", icon: "/Lunch.svg" },
];

interface CategoryCarouselProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function CategoryCarousel({
  selectedId,
  onSelect,
}: CategoryCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanL(el.scrollLeft > 0);
    setCanR(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    sync();
  }, [sync]);

  const scroll = (dir: "left" | "right") =>
    ref.current?.scrollBy({
      left: dir === "left" ? -340 : 340,
      behavior: "smooth",
    });

  return (
    <div className="flex items-center gap-4 w-full">
      <button
        onClick={() => scroll("left")}
        disabled={!canL}
        aria-label="Scroll categories left"
        className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-[--radius-full] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] disabled:opacity-30 hover:shadow-lg transition-shadow"
      >
        <ChevronLeft className="w-5 h-5 text-neutral-950" strokeWidth={2.5} />
      </button>
      <div
        ref={ref}
        onScroll={sync}
        className="flex gap-[53px] overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            isSelected={selectedId === cat.id}
            onClick={() => onSelect(cat.id)}
          />
        ))}
      </div>
      <button
        onClick={() => scroll("right")}
        disabled={!canR}
        aria-label="Scroll categories right"
        className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-[--radius-full] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] disabled:opacity-30 hover:shadow-lg transition-shadow"
      >
        <ChevronRight className="w-5 h-5 text-neutral-950" strokeWidth={2.5} />
      </button>
    </div>
  );
}
