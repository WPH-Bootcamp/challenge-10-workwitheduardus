//  Auth 
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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
  icon: string; // path: /asset/All-Restaurant.svg etc.
}

//  Cart 
export interface CartItem {
  restaurantId: string;
  name: string;
  quantity: number;
  price: number;
}
