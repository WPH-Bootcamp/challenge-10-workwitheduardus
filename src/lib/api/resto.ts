import api from "./axios";
import type { Restaurant, GetAllRestaurantsParams } from "@/types";

export const restoApi = {
  getAll: (params?: GetAllRestaurantsParams): Promise<Restaurant[]> =>
    api.get<Restaurant[]>("/api/resto", { params }).then((r) => r.data),

  getById: (id: string): Promise<Restaurant> =>
    api.get<Restaurant>(`/api/resto/${id}`).then((r) => r.data),

  search: (
    q: string,
    params?: { page?: number; limit?: number },
  ): Promise<Restaurant[]> =>
    api
      .get<Restaurant[]>("/api/resto/search", { params: { q, ...params } })
      .then((r) => r.data),

  getBestSeller: (params?: {
    page?: number;
    limit?: number;
  }): Promise<Restaurant[]> =>
    api
      .get<Restaurant[]>("/api/resto/best-seller", { params })
      .then((r) => r.data),

  getRecommended: (): Promise<Restaurant[]> =>
    api.get<Restaurant[]>("/api/resto/recommended").then((r) => r.data),

  getNearby: (params?: {
    range?: number;
    limit?: number;
  }): Promise<Restaurant[]> =>
    api.get<Restaurant[]>("/api/resto/nearby", { params }).then((r) => r.data),
};
