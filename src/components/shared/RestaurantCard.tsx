import Image from "next/image";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import type { Restaurant } from "@/types";

export default function RestaurantCard({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  const imgSrc =
    restaurant.logo || restaurant.images?.[0] || restaurant.image || "";

  const ratingVal = restaurant.star ?? restaurant.rating ?? 0;
  const locationVal = restaurant.place ?? restaurant.location ?? "";
  const distanceVal = restaurant.distance ?? "";

  return (
    <Link href={`/resto/${restaurant.id}`}>
      <div className="flex flex-row items-center gap-3 p-4 h-[152px] bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] hover:shadow-lg transition-shadow group cursor-pointer">
        {/* Thumbnail — 120×120px, radius 12px */}
        <div className="relative w-[120px] h-[120px] flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100">
          {imgSrc ? (
            <Image 
              src={imgSrc}
              alt={restaurant.name}
              fill
              sizes="120px"
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
              <span className="text-neutral-400 text-[11px]">No image</span>
            </div>
          )}
        </div>

        {/* Info column */}
        <div className="flex flex-col gap-0.5 flex-1 min-w-0 h-[96px] justify-center">
          {/* Name — Text lg/Extrabold 18px/800, tracking -0.02em */}
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 800,
              lineHeight: "32px",
              letterSpacing: "-0.02em",
            }}
            className="text-neutral-950 truncate"
          >
            {restaurant.name}
          </h3>

          {/* Rating row */}
          <div className="flex items-center gap-1 h-[30px]">
            <Star className="w-5 h-5 fill-[#FFAB0D] text-[#FFAB0D] flex-shrink-0" />
            <span
              style={{
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "30px",
                letterSpacing: "-0.03em",
              }}
              className="text-neutral-950"
            >
              {ratingVal}
            </span>
          </div>

          {/* Location + Distance */}
          <div className="flex items-center gap-1.5 h-[30px]">
            <MapPin className="w-4 h-4 flex-shrink-0 text-neutral-500" />
            <span
              style={{
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "30px",
                letterSpacing: "-0.02em",
              }}
              className="text-neutral-950 truncate"
            >
              {locationVal || "—"}
            </span>
            {distanceVal && (
              <>
                <span className="w-[2px] h-[2px] bg-neutral-950 rounded-full flex-shrink-0" />
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "30px",
                    letterSpacing: "-0.02em",
                  }}
                  className="text-neutral-950 flex-shrink-0"
                >
                  {distanceVal}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
