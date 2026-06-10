import Image from "next/image";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
}

export default function CategoryCard({
  category,
  isSelected,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isSelected}
      className={[
        "flex flex-col items-center justify-center gap-1.5",
        "w-[161px] h-[138px] flex-shrink-0 transition-all duration-200",
        isSelected ? "scale-105" : "",
      ].join(" ")}
    >
      {/* Icon box */}
      <div
        className={[
          "w-[161px] h-[100px] flex items-center justify-center p-2 gap-2",
          "rounded-[--radius-2xl] shadow-[0px_0px_20px_rgba(203,202,202,0.25)]",
          "transition-all duration-200",
          isSelected
            ? "bg-white ring-2 ring-primary"
            : "bg-white hover:shadow-lg",
        ].join(" ")}
      >
        {/* Icon image */}
        <div className="relative w-[65px] h-[65px]">
          <Image
            src={category.icon}
            alt={category.label}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Label */}
      <span
        className={[
          "text-lg-bold text-center leading-8 tracking-[-0.03em]",
          "w-[161px] h-[32px] flex items-center justify-center",
          isSelected ? "text-primary" : "text-neutral-950",
        ].join(" ")}
      >
        {category.label}
      </span>
    </button>
  );
}
