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
  category: string;
}

export type BookDetailsRouteParamKey = 'id';
