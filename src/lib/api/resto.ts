import api from "./axios";
import type { Restaurant, GetAllRestaurantsParams } from "@/types";

function extractList(response: unknown): Restaurant[] {
  if (Array.isArray(response)) return response;
  if (response && typeof response === "object" && "data" in response) {
    const nested = (response as { data: unknown }).data;
    if (Array.isArray(nested)) return nested;
  }
  return [];
}

export const restoApi = {
  getAll: async (params?: GetAllRestaurantsParams): Promise<Restaurant[]> => {
    const r = await api.get("/api/resto", { params });
    return extractList(r.data);
  },

  getById: (id: string): Promise<Restaurant> =>
    api.get<Restaurant>(`/api/resto/${id}`).then((r) => r.data),

  search: async (
    q: string,
    params?: { page?: number; limit?: number },
  ): Promise<Restaurant[]> => {
    const r = await api.get("/api/resto/search", { params: { q, ...params } });
    return extractList(r.data);
  },

  getBestSeller: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<Restaurant[]> => {
    const r = await api.get("/api/resto/best-seller", { params });
    return extractList(r.data);
  },

  getRecommended: async (): Promise<Restaurant[]> => {
    const r = await api.get("/api/resto/recommended");
    return extractList(r.data);
  },

  getNearby: async (params?: {
    range?: number;
    limit?: number;
  }): Promise<Restaurant[]> => {
    const r = await api.get("/api/resto/nearby", { params });
    return extractList(r.data);
  },
};
