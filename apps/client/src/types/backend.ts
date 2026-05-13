export interface BookApiItem {
  _id: string;           // MongoDB ID
  title: string;
  author: string;
  description: string;
  price: number;
  image?: string;       // cover image field from Book model
  stock?: number;       // stock count
  ratingAverage?: number;
  ratingCount?: number;
  category?: string;
}
