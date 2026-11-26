export interface GemProduct {
  id: number;
  title: string;
  category: 'gemstone' | 'jewellery';
  price: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
}

/**
 * Prototype-only examples. Replace these fixtures with a trusted catalog API
 * before accepting orders; browser data must never determine final prices or stock.
 */
export const sampleGemProducts: GemProduct[] = [
  {
    id: 10001,
    title: 'Blue Sapphire (Ceylon) - 2.10ct',
    category: 'gemstone',
    price: 1250,
    rating: 5,
    stock: 4,
    brand: 'Evoryn Gems',
    thumbnail: new URL('../assets/gem1.png', import.meta.url).href
  },
  {
    id: 10002,
    title: 'Royal Blue Sapphire Ring - 18K',
    category: 'jewellery',
    price: 2200,
    rating: 5,
    stock: 2,
    brand: 'Evoryn Fine',
    thumbnail: new URL('../assets/gem2.png', import.meta.url).href
  },
  {
    id: 10003,
    title: 'Pigeon Blood Ruby - 1.45ct',
    category: 'gemstone',
    price: 1980,
    rating: 4.8,
    stock: 3,
    brand: 'Evoryn Gems',
    thumbnail: new URL('../assets/gem3.png', import.meta.url).href
  },
  {
    id: 10004,
    title: 'Colombian Emerald Pendant',
    category: 'jewellery',
    price: 1475,
    rating: 4.7,
    stock: 5,
    brand: 'Evoryn Fine',
    thumbnail: new URL('../assets/gem2.png', import.meta.url).href
  }
];
