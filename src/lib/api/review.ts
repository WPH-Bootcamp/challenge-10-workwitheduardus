import api from "./axios";
import type {Review, CreateReviewPayload, UpdateReviewPayload, GetReviewsParams, PaginatedResponse,
} from "@/types";

export const reviewApi = {
  createReview: (body: CreateReviewPayload): Promise<Review> =>
    api.post<Review>("/api/review", body).then((r) => r.data),

  getMyReviews: (
    params?: GetReviewsParams,
  ): Promise<PaginatedResponse<Review>> =>
    api
      .get<PaginatedResponse<Review>>("/api/review/my-reviews", { params })
      .then((r) => r.data),

  getByRestaurant: (
    restaurantId: string,
    params?: GetReviewsParams,
  ): Promise<PaginatedResponse<Review>> =>
    api
      .get<
        PaginatedResponse<Review>
      >(`/api/review/restaurant/${restaurantId}`, { params })
      .then((r) => r.data),

  updateReview: (id: string, body: UpdateReviewPayload): Promise<Review> =>
    api.put<Review>(`/api/review/${id}`, body).then((r) => r.data),

  deleteReview: (id: string): Promise<void> =>
    api.delete(`/api/review/${id}`).then(() => undefined),
};
