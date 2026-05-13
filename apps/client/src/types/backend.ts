export interface ProductApiItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  countInStock?: number;
  category?: string;
}
