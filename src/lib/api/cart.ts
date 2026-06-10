import api from "./axios";
import type {CartResponse, CartItem, AddToCartPayload, UpdateCartPayload,
} from "@/types";


export const cartApi = {
  getCart: (): Promise<CartResponse> =>
    api.get<CartResponse>("/api/cart").then((r) => r.data),

  addItem: (body: AddToCartPayload): Promise<CartItem> =>
    api.post<CartItem>("/api/cart", body).then((r) => r.data),

  updateItem: (id: string, body: UpdateCartPayload): Promise<CartItem> =>
    api.put<CartItem>(`/api/cart/${id}`, body).then((r) => r.data),

  deleteItem: (id: string): Promise<void> =>
    api.delete(`/api/cart/${id}`).then(() => undefined),

  clearCart: (): Promise<void> => api.delete("/api/cart").then(() => undefined),
};
