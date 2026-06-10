import api from "../api/axios";
import type { Restaurant, GetAllRestaurantsParams } from "@/types";

//  restoApi
export const restoApi = {
  getRecommended: (): Promise<Restaurant[]> =>
    api.get<Restaurant[]>("/restaurants/recommended").then((r) => r.data),

  getAll: (params?: GetAllRestaurantsParams): Promise<Restaurant[]> =>
    api.get<Restaurant[]>("/restaurants", { params }).then((r) => r.data),

  getById: (id: string): Promise<Restaurant> =>
    api.get<Restaurant>(`/restaurants/${id}`).then((r) => r.data),
};
