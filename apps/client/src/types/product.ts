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
  price: number;
  rating: number;
  ratingCount: number;
  inStock: boolean;
}

export type ProductDetailsRouteParamKey = 'id';
