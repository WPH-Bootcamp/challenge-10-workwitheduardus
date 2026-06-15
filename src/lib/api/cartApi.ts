import type { AxiosError } from "axios";
import api from "./axios";

// ─── Types 
export interface CartItem {
  id: string;
  menuId: string;
  menuName?: string;
  menuImage?: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName?: string;
  restaurantLogo?: string;
}

export interface CartResponse {
  success: boolean;
  data: CartItem[];
  message?: string;
}

export interface AddToCartPayload {
  menuId: string;
  restaurantId: string;
  quantity: number;
}

export interface UpdateQuantityPayload {
  menuId: string;
  quantity: number;
}

export interface CartApiResponse<T = CartItem[]> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── API Functions 
export const fetchCart = async (): Promise<CartItem[]> => {
  try {
    const response = await api.get<CartResponse>("/api/cart");

    if (response.data?.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    console.warn("[CART] Invalid response structure:", response.data);
    return [];
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;

    if (axiosError.response?.status === 401) {
      console.log("[CART] Auth required");
      return [];
    }

    if (axiosError.response?.status === 500) {
      console.error("[CART] Server error, check backend");
      return [];
    }

    console.error("[CART] Fetch failed:", axiosError.message);
    return [];
  }
};

export const addToCart = async (
  payload: AddToCartPayload,
): Promise<boolean> => {
  try {
    const response = await api.post<CartApiResponse<CartItem>>(
      "/api/cart",
      payload,
    );

    return response.data?.success === true;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error("[CART] Add to cart failed:", axiosError.message);
    return false;
  }
};

export const updateCartItemQuantity = async (
  payload: UpdateQuantityPayload,
): Promise<boolean> => {
  try {
    const response = await api.post<CartApiResponse<CartItem>>(
      "/api/cart",
      payload,
    );

    return response.data?.success === true;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error("[CART] Update quantity failed:", axiosError.message);
    return false;
  }
};

export const removeFromCart = async (menuId: string): Promise<boolean> => {
  try {
    const response = await api.delete<CartApiResponse>(`/api/cart/${menuId}`);
    return response.data?.success === true;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error("[CART] Remove from cart failed:", axiosError.message);
    return false;
  }
};

export const clearCart = async (): Promise<boolean> => {
  try {
    const response = await api.delete<CartApiResponse>("/api/cart");
    return response.data?.success === true;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error("[CART] Clear cart failed:", axiosError.message);
    return false;
  }
};
