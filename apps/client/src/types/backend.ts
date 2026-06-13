export interface BookApiItem {
  _id: string;           // MongoDB ID
  title: string;
  author: string;
  description: string;
  price: number;
  image?: string;       // cover image field from Book model
  stock?: number;       // stock count
  reservedStock?: number; // quantity held by active checkout reservations
  ratingAverage?: number;
  ratingCount?: number;
  category?: string;
}
