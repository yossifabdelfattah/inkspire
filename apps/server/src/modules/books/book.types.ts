export interface BookQuery {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

export interface CreateBookInput {
  title?: string;
  author?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  stock?: number;
}
