"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";
import CategoryCard from "../../components/shared/CategoryCard";
import RestaurantCard from "../../components/shared/RestaurantCard";
import type { Category, Restaurant } from "@/types";


const CATEGORIES: Category[] = [
  { id: "all", label: "All Restaurant", icon: "/asset/All-Restaurant.svg" },
  { id: "nearby", label: "Nearby", icon: "/asset/Location.svg" },
  { id: "discount", label: "Discount", icon: "/asset/Discount.svg" },
  { id: "bestseller", label: "Best Seller", icon: "/asset/Best-Seller.svg" },
  { id: "delivery", label: "Delivery", icon: "/asset/Delivery.svg" },
  { id: "lunch", label: "Lunch", icon: "/asset/Lunch.svg" },
];

const MOCK_RESTAURANTS: Restaurant[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  name: "Burger King",
  image: "/images/burger-king.jpg",
  rating: 4.9,
  location: "Jakarta Selatan",
  distance: "2.4 km",
}));

// Search Bar 

function SearchBar() {
  return (
    <div className="flex items-center gap-1.5 w-[604px] h-14 px-6 bg-white rounded-[--radius-full] shadow-md">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="flex-shrink-0"
      >
        <circle cx="8.5" cy="8.5" r="6" stroke="#717680" strokeWidth="1.25" />
        <path
          d="M13 13l4 4"
          stroke="#717680"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="text"
        placeholder="Search restaurants, food and drink"
        className="flex-1 text-md-regular text-neutral-600 placeholder:text-neutral-500 bg-transparent outline-none"
      />
    </div>
  );
}

//  Hero
function HomeHero() {
  return (
    <section className="relative w-full h-[827px] overflow-hidden">
      <Image
        src="/images/hero-bg.jpg"
        alt="Food background"
        fill
        priority
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,rgba(0,0,0,0) -59.98%,rgba(0,0,0,0.8) 110.09%)",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center gap-2 max-w-[712px]">
          <h1 className="display-2xl-extrabold text-white text-center">
            Explore Culinary Experiences
          </h1>
          <p className="display-xs-bold text-white text-center">
            Search and refine your choice to discover the perfect restaurant.
          </p>
        </div>
        <SearchBar />
      </div>
    </section>
  );
}

//  Category Carousel
function CategoryCarousel({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
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
        aria-label="Geser kiri"
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
        aria-label="Geser kanan"
        className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-[--radius-full] bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)] disabled:opacity-30 hover:shadow-lg transition-shadow"
      >
        <ChevronRight className="w-5 h-5 text-neutral-950" strokeWidth={2.5} />
      </button>
    </div>
  );
}

//  Recommended Grid 
function RecommendedSection() {
  const [shown, setShown] = useState(9);
  const restaurants: Restaurant[] = MOCK_RESTAURANTS;
  const visible = restaurants.slice(0, shown);
  const hasMore = shown < restaurants.length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="display-md-extrabold text-neutral-950">Recommended</h2>
        <Link
          href="/restaurants"
          className="text-lg-extrabold text-primary hover:text-red-700 transition-colors"
        >
          See All
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {visible.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShown((p) => p + 9)}
            className="w-40 h-12 border border-neutral-300 rounded-[--radius-full] text-md-bold text-neutral-950 hover:bg-neutral-50 transition-colors"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}

// Page 

// HomePage.tsx — src/app/(main)/page.tsx
export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header scrolled={scrolled} />
      </div>
      <HomeHero />
      <main className="flex-1 flex flex-col">
        <section className="w-full px-[120px] py-8">
          <CategoryCarousel
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </section>
        <section className="w-full px-[120px] pt-4 pb-20">
          <RecommendedSection />
        </section>
      </main>
      <Footer />
    </div>
  );
}
