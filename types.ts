
export enum Size {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL'
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: Record<string, number>;
  sizes: string[];
  images: string[];
  category: string; // Keep for legacy/display
  categoryRelation?: Category; // For relation
  createdAt: string;
}

export interface Sale {
  id: string;
  product: Product;
  quantity: number;
  size: string;
  totalPrice: string;
  paymentMethod?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  date: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export enum SectionType {
  PRODUCT_GRID = 'PRODUCT_GRID',
  BANNER = 'BANNER',
  TEXT = 'TEXT',
}

export interface Section {
  id: string;
  title: string;
  subtitle?: string;
  type: SectionType;
  content: any; // e.g., { categoryId: '...', imageUrl: '...', textBody: '...' }
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
