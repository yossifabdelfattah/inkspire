export interface Product {
  _id: string;
  name: string;
  price: number;
}

export interface Book {
  id: string;
  cover: string;
  title: string;
  author: string;
  description: string;
  price: number;
  rating: number;
  ratingCount: number;
  inStock: boolean;
  availableStock: number;
}

export type ProductDetailsRouteParamKey = 'id';
