"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CategoryCard from "@/components/shared/CategoryCard";
import type { Category } from "@/types";

const CATEGORIES: Category[] = [
  { id: "all", label: "All Restaurant", icon: "/All-Restaurant.svg" },
  { id: "nearby", label: "Nearby", icon: "/Location.svg" },
  { id: "bestseller", label: "Best Seller", icon: "/Best-Seller.svg" },
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
  const [canR, setCanR] = useState(false);

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
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });

  return (
    <div className="flex items-center gap-2 lg:gap-4 w-full">
      <button
        onClick={() => scroll("left")}
        disabled={!canL}
        aria-label="Scroll left"
        className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] disabled:opacity-30 hover:shadow-lg transition-shadow"
      >
        <ChevronLeft
          className="w-4 h-4 lg:w-5 lg:h-5 text-neutral-950"
          strokeWidth={2.5}
        />
      </button>

      <div
        ref={ref}
        onScroll={sync}
        className="flex gap-4 lg:gap-[53px] overflow-x-auto flex-1 justify-center"
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
        aria-label="Scroll right"
        className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] disabled:opacity-30 hover:shadow-lg transition-shadow"
      >
        <ChevronRight
          className="w-4 h-4 lg:w-5 lg:h-5 text-neutral-950"
          strokeWidth={2.5}
        />
      </button>
    </div>
  );
}
