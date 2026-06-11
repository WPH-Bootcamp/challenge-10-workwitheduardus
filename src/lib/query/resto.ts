import { useQuery } from "@tanstack/react-query";
import { restoApi } from "@/lib/api/resto";
import type { GetAllRestaurantsParams } from "@/types";

export const restoKeys = {
  all: ["resto"] as const,
  list: (params: object) => [...restoKeys.all, "list", params] as const,
  detail: (id: string) => [...restoKeys.all, "detail", id] as const,
  search: (q: string) => [...restoKeys.all, "search", q] as const,
  bestSeller: () => [...restoKeys.all, "best-seller"] as const,
  recommended: () => [...restoKeys.all, "recommended"] as const,
  nearby: (params: object) => [...restoKeys.all, "nearby", params] as const,
};

export function useRestaurants(params?: GetAllRestaurantsParams) {
  return useQuery({
    queryKey: restoKeys.list(params ?? {}),
    queryFn: () => restoApi.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRestaurantDetail(id: string) {
  return useQuery({
    queryKey: restoKeys.detail(id),
    queryFn: () => restoApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearchRestaurants(
  q: string,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: restoKeys.search(q),
    queryFn: () => restoApi.search(q, params),
    enabled: q.length > 0, // only search when query is not empty
    staleTime: 2 * 60 * 1000,
  });
}

export function useBestSellerRestaurants(params?: {
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: restoKeys.bestSeller(),
    queryFn: () => restoApi.getBestSeller(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecommendedRestaurants() {
  return useQuery({
    queryKey: restoKeys.recommended(),
    queryFn: restoApi.getRecommended,
    staleTime: 5 * 60 * 1000,
  });
}
export function useNearbyRestaurants(params?: {
  range?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: restoKeys.nearby(params ?? {}),
    queryFn: () => restoApi.getNearby(params),
    staleTime: 5 * 60 * 1000,
  });
}
