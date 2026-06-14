//  Auth
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  avatar?: string;
}

// Restaurant
export interface Restaurant {
  id:string;
  name:string;
  image:string;
  logo?:string;
  images?:string[];
  star?:number;
  rating?:number;
  place?:string;
  location?:string;
  distance?:string;
  category?:string;
  reviewCount?: number;
  menuCount?:number;
  priceRange?:  { min: number; max: number };
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
  location?: string;
  range?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
}

//  Cart
export interface CartItem {
  id: string;
  restaurantId: string;
  menuId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CartGroup {
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
}

export type CartResponse = CartGroup[];

export interface AddToCartPayload {
  restaurantId: string;
  menuId: string;
  quantity: number;
}

export interface UpdateCartPayload {
  quantity: number;
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

// Post
export interface CheckoutItem {
  menuId: string;
  quantity: number;
}

export interface CheckoutRestaurant {
  restaurantId: string;
  items: CheckoutItem[];
}

export interface CheckoutPayload {
  restaurants: CheckoutRestaurant[];
  deliveryAddress: string;
  phone?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface GetMyOrdersParams {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

// Review
export interface Review {
  id: string;
  restaurantId: string;
  transactionId: string;
  star: number;
  comment: string;
  menuIds?: string[];
  createdAt: string;
}

export interface CreateReviewPayload {
  transactionId: string;
  restaurantId: string;
  star: number;
  comment: string;
  menuIds?: string[];
}

export interface UpdateReviewPayload {
  star?: number;
  comment?: string;
}

export interface GetReviewsParams {
  page?: number;
  limit?: number;
}
