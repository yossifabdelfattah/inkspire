import { Inventory } from './inventory.model';
import { IStore } from './store.model';

export interface BookStore {
  _id: unknown;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  stock: number;
}

// Returns the physical stores that currently have a given book in stock.
export const getStoresForBook = async (bookId: string): Promise<BookStore[]> => {
  const inventory = await Inventory.find({ book: bookId, stock: { $gt: 0 } })
    .populate<{ store: IStore | null }>('store')
    .sort({ stock: -1 });

  return inventory
    .filter((item) => item.store)
    .map((item) => {
      const store = item.store as IStore;
      return {
        _id: store._id,
        name: store.name,
        address: store.address,
        city: store.city,
        latitude: store.latitude,
        longitude: store.longitude,
        stock: item.stock,
      };
    });
};
