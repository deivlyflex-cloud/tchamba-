export type Category = 'Todos' | 'Combos' | 'Cheese Drums' | 'Acompanhamentos' | 'Bebidas' | 'Eventos';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, 'Todos'>;
  image: string;
  badge?: string;
  badgeType?: 'top' | 'favorito' | 'familia' | 'original' | 'especial' | 'combo' | 'evento';
  isConsultation?: boolean;
  pieces?: string;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface CustomerOrderInfo {
  name: string;
  phone: string;
  zone: string;
  address: string;
  notes?: string;
}
