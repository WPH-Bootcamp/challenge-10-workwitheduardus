// HomeHero.tsx — src/components/home/HomeHero.tsx
// Figma Frame 85: width 1440px, height 827px
// Image: full bleed background
// Rectangle 5: gradient linear-gradient(180deg, rgba(0,0,0,0) -59.98%, rgba(0,0,0,0.8) 110.09%)
// Frame 87: flex-col, center, gap 40px, width 712px, height 200px, top 326px

import Image from "next/image";
import SearchBar from "./Seachbar";

interface HomeHeroProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export default function HomeHero({
  searchValue,
  onSearchChange,
}: HomeHeroProps) {
  return (
    <section className="relative w-full h-[827px] overflow-hidden">
      <Image
        src="/images/hero-bg.jpg"
        alt="Culinary background"
        fill
        priority
        className="object-cover object-center"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) -59.98%, rgba(0,0,0,0.8) 110.09%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center gap-2 w-[712px]">
          <h1 className="display-2xl-extrabold leading-[60px] text-center text-white w-[712px]">
            Explore Culinary Experiences
          </h1>

          <p className="display-xs-bold leading-9 text-white w-[712px]">
            Search and refine your choice to discover the perfect restaurant.
          </p>
        </div>

        <SearchBar value={searchValue} onChange={onSearchChange} />
      </div>
    </section>
  );
}
