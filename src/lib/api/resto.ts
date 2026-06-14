import api from "./axios";
import type { Restaurant, GetAllRestaurantsParams } from "@/types";

function extractList(axiosData: unknown): Restaurant[] {
  if (!axiosData) return [];
  if (Array.isArray(axiosData)) return axiosData;

  if (typeof axiosData === "object") {
    const obj = axiosData as Record<string, unknown>;

    // { data: { restaurants: [] } }
    if (obj.data && typeof obj.data === "object") {
      const inner = obj.data as Record<string, unknown>;
      if (Array.isArray(inner.restaurants))
        return inner.restaurants as Restaurant[];
      if (Array.isArray(inner.data)) return inner.data as Restaurant[];
      if (Array.isArray(inner.items)) return inner.items as Restaurant[];
      if (Array.isArray(inner)) return inner as Restaurant[];
    }

    // { data: [] }
    if (Array.isArray(obj.data)) return obj.data as Restaurant[];

    // flat keys
    for (const k of ["restaurants", "items", "result", "results", "list"]) {
      if (Array.isArray(obj[k])) return obj[k] as Restaurant[];
    }
  }
  return [];
}

export const restoApi = {
  getAll: async (params?: GetAllRestaurantsParams): Promise<Restaurant[]> => {
    const r = await api.get("/api/resto", { params });
    return extractList(r.data);
  },

  getById: async (id: string): Promise<Restaurant> => {
    const r = await api.get(`/api/resto/${id}`);
    const d = r.data?.data;
    return (d?.restaurant ?? d ?? r.data) as Restaurant;
  },

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
