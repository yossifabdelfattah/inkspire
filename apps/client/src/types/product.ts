export interface Product {
  _id: string;
  name: string;
  price: number;
}

export interface Book {
  id: number;
  cover: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  inStock: boolean;
}

export type ProductDetailsRouteParamKey = 'id';
