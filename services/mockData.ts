
import { Product, Size } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Buzo Sol de Mayo - Minimal',
    description: 'Buzo de algodón premium con bordado sutil del sol argentino en el pecho. Identidad que te acompaña.',
    price: 65,
    sizes: [Size.S, Size.M, Size.L],
    imageUrl: 'https://picsum.photos/seed/orau1/800/1000',
    category: 'Buzos',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Remera Austral Blanca',
    description: 'Remera de calce relajado. Detalle bordado "Orgullo Austral" en la nuca.',
    price: 35,
    sizes: [Size.XS, Size.S, Size.M, Size.L, Size.XL],
    imageUrl: 'https://picsum.photos/seed/orau2/800/1000',
    category: 'Remeras',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Buzo Horizonte Gris',
    description: 'Textura suave y calce moderno. Inspirado en los atardeceres de la pampa.',
    price: 70,
    sizes: [Size.M, Size.L, Size.XL],
    imageUrl: 'https://picsum.photos/seed/orau3/800/1000',
    category: 'Buzos',
    createdAt: new Date().toISOString()
  }
];
