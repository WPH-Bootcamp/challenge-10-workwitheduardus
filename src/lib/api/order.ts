import api from "./axios";
import type {Order, CheckoutPayload, GetMyOrdersParams, PaginatedResponse,
} from "@/types";

export const orderApi = {
  checkout: (body: CheckoutPayload): Promise<Order> =>
    api.post<Order>("/api/order/checkout", body).then((r) => r.data),

  getMyOrders: (
    params?: GetMyOrdersParams,
  ): Promise<PaginatedResponse<Order>> =>
    api
      .get<PaginatedResponse<Order>>("/api/order/my-order", { params })
      .then((r) => r.data),
};
