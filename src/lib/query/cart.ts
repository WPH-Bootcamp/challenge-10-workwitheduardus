import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";
import { useCartStore } from "@/store/cartStore";
import type { AddToCartPayload, UpdateCartPayload } from "@/types";

export const cartKeys = {
  all: ["cart"] as const,
  list: () => [...cartKeys.all, "list"] as const,
};

export function useCart() {
  return useQuery({
    queryKey: cartKeys.list(),
    queryFn: cartApi.getCart,
    staleTime: 0,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const addItem = useCartStore((s) => s.addItem);

  return useMutation({
    mutationFn: (body: AddToCartPayload) => cartApi.addItem(body),
    onSuccess: (newItem) => {
      addItem({
        id: newItem.id,
        restaurantId: newItem.restaurantId,
        menuId: newItem.menuId,
        name: newItem.name,
        quantity: newItem.quantity,
        price: newItem.price,
      });
      queryClient.invalidateQueries({ queryKey: cartKeys.list() });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateCartPayload }) =>
      cartApi.updateItem(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.list() });
    },
  });
}

export function useDeleteCartItem() {
  const queryClient = useQueryClient();
  const removeItem = useCartStore((s) => s.removeItem);

  return useMutation({
    mutationFn: (id: string) => cartApi.deleteItem(id),
    onSuccess: (_data, id) => {
      removeItem(id);
      queryClient.invalidateQueries({ queryKey: cartKeys.list() });
    },
  });
}
export function useClearCart() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((s) => s.clearCart);

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: cartKeys.list() });
    },
  });
}
