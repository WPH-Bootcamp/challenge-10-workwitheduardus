// HomePage.tsx — src/app/(main)/page.tsx
"use client";

import { useState, useEffect } from "react";
import Header from "../../components/shared/Header";
import Footer from "../../components/shared/Footer";
import HomeHero from "../../components/home/HomeHero";
import CategoryCarousel from "../../components/home/Categorycarousel";
import RecommendedSection from "../../components/home/Recommendedsection";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");

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

      <HomeHero searchValue={searchValue} onSearchChange={setSearchValue} />

      <main className="flex-1 flex flex-col">
        <section className="w-full px-4 lg:px-[120px] py-8">
          <CategoryCarousel
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </section>

        <section className="w-full px-4 lg:px-[120px] pt-4 pb-20">
          <RecommendedSection categoryId={selectedCategory} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
