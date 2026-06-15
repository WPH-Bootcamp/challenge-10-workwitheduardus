

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import * as cartApi from "../api/cartapi";
import type {
  CartItem,
  AddToCartPayload,
  UpdateQuantityPayload,
} from "../../lib/api/cartapi";

// ─── Query Key Factory 
export const cartKeys = {
  all: ["cart"] as const,
  list: () => [...cartKeys.all, "list"] as const,
  detail: (id: string) => [...cartKeys.all, "detail", id] as const,
} as const;

// ─── useCartQuery Hook 
export const useCartQuery = (): UseQueryResult<CartItem[], Error> => {
  return useQuery({
    queryKey: cartKeys.list(),
    queryFn: cartApi.fetchCart,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
};

// ─── useAddToCart Hook 
export const useAddToCart = (): UseMutationResult<
  boolean,
  Error,
  AddToCartPayload,
  unknown
> => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartPayload) => cartApi.addToCart(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cartKeys.list() });
    },
    onError: (error: Error) => {
      console.error("Add to cart error:", error.message);
    },
  });
};

// ─── useUpdateCartQuantity Hook 
export const useUpdateCartQuantity = (): UseMutationResult<
  boolean,
  Error,
  UpdateQuantityPayload,
  unknown
> => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateQuantityPayload) =>
      cartApi.updateCartItemQuantity(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cartKeys.list() });
    },
    onError: (error: Error) => {
      console.error("Update quantity error:", error.message);
    },
  });
};

// ─── useRemoveFromCart Hook
export const useRemoveFromCart = (): UseMutationResult<
  boolean,
  Error,
  string,
  unknown
> => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (menuId: string) => cartApi.removeFromCart(menuId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cartKeys.list() });
    },
    onError: (error: Error) => {
      console.error("Remove from cart error:", error.message);
    },
  });
};

// ─── useClearCart Hook 
export const useClearCart = (): UseMutationResult<
  boolean,
  Error,
  void,
  unknown
> => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cartKeys.list() });
    },
    onError: (error: Error) => {
      console.error("Clear cart error:", error.message);
    },
  });
};
