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
    <section className="relative w-full h-[500px] sm:h-[650px] lg:h-[827px] overflow-hidden">
      <Image
        src="/burger-home.png"
        alt="Culinary background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) -59.98%, rgba(0,0,0,0.8) 110.09%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 pt-6 lg:pt-0 lg:justify-start">
        <div className="hidden lg:block" style={{ height: "246px" }} />

        {/* Text block */}
        <div className="flex flex-col items-center gap-2 w-full max-w-[712px]">
          <h1
            className="font-extrabold text-center text-white"
            style={{ fontSize: "clamp(24px, 4vw, 48px)", lineHeight: 1.25 }}
          >
            Explore Culinary Experiences
          </h1>
          <p
            className="font-bold text-center text-white"
            style={{ fontSize: "clamp(14px, 2vw, 24px)", lineHeight: 1.5 }}
          >
            Search and refine your choice to discover the perfect restaurant.
          </p>
        </div>

        {/* Gap between text and search */}
        <div className="h-2 lg:h-4" />

        <SearchBar value={searchValue} onChange={onSearchChange} />
      </div>
    </section>
  );
}