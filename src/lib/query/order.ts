import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/lib/api/order";
import { useClearCart } from "@/lib/query/cart";
import type { CheckoutPayload, GetMyOrdersParams } from "@/types";

export const orderKeys = {
  all: ["orders"] as const,
  list: (params?: GetMyOrdersParams) =>
    [...orderKeys.all, "list", params ?? {}] as const,
};

export function useMyOrders(params?: GetMyOrdersParams) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => orderApi.getMyOrders(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();
  const { mutate: clearCart } = useClearCart();

  return useMutation({
    mutationFn: (body: CheckoutPayload) => orderApi.checkout(body),
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
