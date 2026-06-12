import Image from "next/image";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import type { Restaurant } from "@/types";

export default function RestaurantCard({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  return (
    <Link href={`/resto/${restaurant.id}`}>
      {/* Card container  */}
      <div className="flex flex-row items-center gap-3 p-4 h-[152px] bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] hover:shadow-lg transition-shadow group">
        {/* Thumbnail */}
        <div className="relative w-[120px] h-[120px] flex-shrink-0 rounded-[12px] overflow-hidden bg-neutral-200">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            sizes="120px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex flex-col gap-0.5 flex-1 min-w-0 h-[96px] justify-center">
          {/* Name*/}
          <h3 className="text-lg-extrabold leading-8 tracking-[-0.02em] text-neutral-950 truncate">
            {restaurant.name}
          </h3>

          {/* Rating row */}
          <div className="flex items-center gap-1 h-[30px]">
            {/* Star icon  */}
            <Star className="w-6 h-6 fill-accent-yellow text-accent-yellow flex-shrink-0" />

            {/* Rating number*/}
            <span className="text-md-medium leading-[30px] tracking-[-0.03em] text-neutral-950">
              {restaurant.rating}
            </span>
          </div>

          {/* Location + Distance */}
          <div className="flex items-center gap-1.5 h-[30px]">
            <MapPin className="w-4 h-4 flex-shrink-0 text-neutral-500" />

            {/* Location text*/}
            <span className="text-md-regular leading-[30px] tracking-[-0.02em] text-neutral-950 truncate">
              {restaurant.location}
            </span>

            {/* Dot separator — */}
            <span className="w-[2px] h-[2px] bg-neutral-950 rounded-full flex-shrink-0" />

            {/* Distance text */}
            <span className="text-md-regular leading-[30px] tracking-[-0.02em] text-neutral-950 flex-shrink-0">
              {restaurant.distance}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}