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
  isActive?: boolean;
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

export type OrderStatus =
  | 'Novo'
  | 'Confirmado'
  | 'Em preparação'
  | 'Pronto'
  | 'Concluído'
  | 'Cancelado';

export interface OrderItemRecord {
  id?: string;
  order_id?: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at?: string;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  neighborhood: string;
  notes?: string;
  status: OrderStatus;
  subtotal: number;
  total: number;
  created_at: string;
  updated_at: string;
  items?: OrderItemRecord[];
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  neighborhood?: string;
  total_orders: number;
  total_spent: number;
  last_order_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  display_order?: number;
  created_at?: string;
}

export interface EventOrderRecord {
  id: string;
  event_code: string;
  customer_name: string;
  customer_phone: string;
  event_date: string;
  event_time?: string;
  product_name: string;
  quantity_packages: number;
  package_type: string;
  total_pieces: number;
  location: string;
  neighborhood?: string;
  notes?: string;
  total_value: number;
  status: 'Novo' | 'Confirmado' | 'Em produção' | 'Concluído' | 'Cancelado';
  created_at: string;
}

export interface StoreSettingsRecord {
  id?: string;
  store_name: string;
  slogan: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  opening_time: string;
  closing_time: string;
  logo_url?: string;
  banner_url?: string;
}
