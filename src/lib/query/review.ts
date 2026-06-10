import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/lib/api/review";
import type {
  CreateReviewPayload,
  UpdateReviewPayload,
  GetReviewsParams,
} from "@/types";

export const reviewKeys = {
  all: ["reviews"] as const,
  mine: () => [...reviewKeys.all, "mine"] as const,
  byRestaurant: (restaurantId: string) =>
    [...reviewKeys.all, "restaurant", restaurantId] as const,
};

export function useMyReviews(params?: GetReviewsParams) {
  return useQuery({
    queryKey: reviewKeys.mine(),
    queryFn: () => reviewApi.getMyReviews(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRestaurantReviews(
  restaurantId: string,
  params?: GetReviewsParams,
) {
  return useQuery({
    queryKey: reviewKeys.byRestaurant(restaurantId),
    queryFn: () => reviewApi.getByRestaurant(restaurantId, params),
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateReviewPayload) => reviewApi.createReview(body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.mine() });
      queryClient.invalidateQueries({
        queryKey: reviewKeys.byRestaurant(variables.restaurantId),
      });
    },
  });
}

export function useUpdateReview(restaurantId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateReviewPayload }) =>
      reviewApi.updateReview(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.mine() });
      if (restaurantId) {
        queryClient.invalidateQueries({
          queryKey: reviewKeys.byRestaurant(restaurantId),
        });
      }
    },
  });
}

export function useDeleteReview(restaurantId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewApi.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.mine() });
      if (restaurantId) {
        queryClient.invalidateQueries({
          queryKey: reviewKeys.byRestaurant(restaurantId),
        });
      }
    },
  });
}
