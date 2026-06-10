//  Auth
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Restaurant
export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  location: string;
  distance: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

// API Response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// resto API param
export interface GetAllRestaurantsParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

//  Cart
export interface CartItem {
  restaurantId: string;
  name: string;
  quantity: number;
  price: number;
}

// Order
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "delivering"
  | "done"
  | "cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}