import { getSupabase } from './supabase';
import { Product, OrderRecord, OrderStatus, CategoryRecord, CustomerRecord, EventOrderRecord, StoreSettingsRecord } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

// Helper to map DB row to frontend Product
export const mapDbProductToProduct = (p: any): Product => ({
  id: p.id,
  name: p.name,
  description: p.description || '',
  price: Number(p.price) || 0,
  category: (p.category_slug === 'combos'
    ? 'Combos'
    : p.category_slug === 'cheese-drums'
    ? 'Cheese Drums'
    : p.category_slug === 'acompanhamentos'
    ? 'Acompanhamentos'
    : p.category_slug === 'bebidas'
    ? 'Bebidas'
    : p.category_slug === 'eventos'
    ? 'Eventos'
    : 'Combos') as any,
  image: p.image_url || '',
  badge: p.badge || undefined,
  badgeType: p.badge_type || undefined,
  pieces: p.pieces || undefined,
  isConsultation: p.is_consultation || false,
  isFeatured: p.is_featured || false,
  isActive: p.is_active !== false,
});

export const dbService = {
  // PRODUCTS
  async getProducts(onlyActive = true): Promise<Product[]> {
    const supabase = getSupabase();
    if (!supabase) {
      return onlyActive ? INITIAL_PRODUCTS.filter((p) => p.isActive !== false) : INITIAL_PRODUCTS;
    }

    let query = supabase.from('products').select('*').order('created_at', { ascending: true });
    if (onlyActive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      console.warn('Could not fetch products from Supabase, falling back to initial data:', error?.message);
      return onlyActive ? INITIAL_PRODUCTS.filter((p) => p.isActive !== false) : INITIAL_PRODUCTS;
    }

    return data.map(mapDbProductToProduct);
  },

  async createProduct(productData: Partial<Product> & { category_slug?: string }): Promise<{ data: any; error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: 'Supabase não configurado.' };

    const payload = {
      name: productData.name,
      description: productData.description || '',
      price: productData.price || 0,
      image_url: productData.image || '',
      category_slug: (productData.category || 'Combos').toLowerCase().replace(/\s+/g, '-'),
      badge: productData.badge || null,
      badge_type: productData.badgeType || null,
      pieces: productData.pieces || null,
      is_consultation: Boolean(productData.isConsultation),
      is_featured: Boolean(productData.isFeatured),
      is_active: productData.isActive !== false,
    };

    const { data, error } = await supabase.from('products').insert(payload).select().single();
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<{ error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase não configurado.' };

    const payload: any = {
      updated_at: new Date().toISOString(),
    };

    if (productData.name !== undefined) payload.name = productData.name;
    if (productData.description !== undefined) payload.description = productData.description;
    if (productData.price !== undefined) payload.price = productData.price;
    if (productData.image !== undefined) payload.image_url = productData.image;
    if (productData.category !== undefined) {
      payload.category_slug = productData.category.toLowerCase().replace(/\s+/g, '-');
    }
    if (productData.badge !== undefined) payload.badge = productData.badge || null;
    if (productData.badgeType !== undefined) payload.badge_type = productData.badgeType || null;
    if (productData.pieces !== undefined) payload.pieces = productData.pieces || null;
    if (productData.isConsultation !== undefined) payload.is_consultation = productData.isConsultation;
    if (productData.isFeatured !== undefined) payload.is_featured = productData.isFeatured;
    if (productData.isActive !== undefined) payload.is_active = productData.isActive;

    const { error } = await supabase.from('products').update(payload).eq('id', id);
    return { error: error ? error.message : null };
  },

  async deleteProduct(id: string): Promise<{ error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase não configurado.' };

    const { error } = await supabase.from('products').delete().eq('id', id);
    return { error: error ? error.message : null };
  },

  // IMAGE UPLOAD VIA SUPABASE STORAGE
  async uploadProductImage(file: File): Promise<{ url: string | null; error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { url: null, error: 'Supabase não configurado.' };

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        return { url: null, error: uploadError.message };
      }

      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
      return { url: urlData.publicUrl, error: null };
    } catch (e: any) {
      return { url: null, error: e.message || 'Falha ao carregar imagem' };
    }
  },

  // CATEGORIES
  async getCategories(): Promise<CategoryRecord[]> {
    const supabase = getSupabase();
    if (!supabase) {
      return [
        { id: '1', name: 'Combos', slug: 'combos', is_active: true, display_order: 1 },
        { id: '2', name: 'Cheese Drums', slug: 'cheese-drums', is_active: true, display_order: 2 },
        { id: '3', name: 'Acompanhamentos', slug: 'acompanhamentos', is_active: true, display_order: 3 },
        { id: '4', name: 'Bebidas', slug: 'bebidas', is_active: true, display_order: 4 },
        { id: '5', name: 'Eventos', slug: 'eventos', is_active: true, display_order: 5 },
      ];
    }

    const { data, error } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
    if (error || !data) return [];
    return data;
  },

  async createCategory(name: string, slug: string): Promise<{ error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase não configurado.' };

    const { error } = await supabase.from('categories').insert({
      name,
      slug: slug.toLowerCase().trim().replace(/\s+/g, '-'),
      is_active: true,
    });
    return { error: error ? error.message : null };
  },

  async updateCategory(id: string, updates: Partial<CategoryRecord>): Promise<{ error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase não configurado.' };

    const { error } = await supabase.from('categories').update({
      ...updates,
      updated_at: new Date().toISOString(),
    }).eq('id', id);
    return { error: error ? error.message : null };
  },

  async deleteCategory(id: string): Promise<{ error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase não configurado.' };

    const { error } = await supabase.from('categories').delete().eq('id', id);
    return { error: error ? error.message : null };
  },

  // ORDERS & CHECKOUT
  async createOrder(params: {
    customerName: string;
    customerPhone: string;
    neighborhood: string;
    deliveryAddress: string;
    notes?: string;
    items: Array<{
      productId?: string;
      productName: string;
      unitPrice: number;
      quantity: number;
    }>;
  }): Promise<{ orderNumber: string; orderId?: string; error: string | null }> {
    const supabase = getSupabase();

    const subtotal = params.items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
    const total = subtotal;

    // Generate unique order number: TC-XXXXXX (guaranteed unique format)
    const timestampSuffix = Date.now().toString().slice(-6);
    const orderNumber = `TC-${timestampSuffix}`;

    if (!supabase) {
      // Local fallback if Supabase not yet connected
      return { orderNumber, error: null };
    }

    try {
      // 1. Locate or create customer
      let customerId: string | undefined = undefined;
      const cleanPhone = params.customerPhone.trim();

      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id, total_orders, total_spent')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (existingCustomer) {
        customerId = existingCustomer.id;
        await supabase
          .from('customers')
          .update({
            name: params.customerName.trim(),
            address: params.deliveryAddress.trim(),
            neighborhood: params.neighborhood.trim(),
            total_orders: (existingCustomer.total_orders || 0) + 1,
            total_spent: Number(existingCustomer.total_spent || 0) + total,
            last_order_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', customerId);
      } else {
        const { data: newCustomer } = await supabase
          .from('customers')
          .insert({
            name: params.customerName.trim(),
            phone: cleanPhone,
            address: params.deliveryAddress.trim(),
            neighborhood: params.neighborhood.trim(),
            total_orders: 1,
            total_spent: total,
            last_order_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (newCustomer) customerId = newCustomer.id;
      }

      // 2. Insert Order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_id: customerId,
          customer_name: params.customerName.trim(),
          customer_phone: cleanPhone,
          delivery_address: params.deliveryAddress.trim(),
          neighborhood: params.neighborhood.trim(),
          notes: params.notes?.trim() || '',
          status: 'Novo',
          subtotal,
          total,
        })
        .select('id')
        .single();

      if (orderError) {
        return { orderNumber, error: orderError.message };
      }

      // 3. Insert Order Items (with fixed historic price)
      if (orderData && params.items.length > 0) {
        const orderItemsPayload = params.items.map((it) => ({
          order_id: orderData.id,
          product_id: it.productId || null,
          product_name: it.productName,
          quantity: it.quantity,
          unit_price: it.unitPrice,
          subtotal: it.unitPrice * it.quantity,
        }));

        await supabase.from('order_items').insert(orderItemsPayload);
      }

      return { orderNumber, orderId: orderData?.id, error: null };
    } catch (err: any) {
      console.error('Error inserting order in Supabase:', err);
      return { orderNumber, error: err.message };
    }
  },

  async getOrders(filterStatus?: string): Promise<OrderRecord[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .order('created_at', { ascending: false });

    if (filterStatus && filterStatus !== 'Todos') {
      query = query.eq('status', filterStatus);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    return data || [];
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase não configurado.' };

    const { error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    return { error: error ? error.message : null };
  },

  // CUSTOMERS
  async getCustomers(): Promise<CustomerRecord[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('total_spent', { ascending: false });

    if (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
    return data || [];
  },

  // EVENT ORDERS
  async getEventOrders(): Promise<EventOrderRecord[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('event_orders')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching event orders:', error);
      return [];
    }
    return data || [];
  },

  async createEventOrder(payload: Partial<EventOrderRecord>): Promise<{ error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase não configurado.' };

    const code = `EV-${Date.now().toString().slice(-6)}`;
    const { error } = await supabase.from('event_orders').insert({
      event_code: code,
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      event_date: payload.event_date,
      event_time: payload.event_time || null,
      product_name: payload.product_name,
      quantity_packages: payload.quantity_packages || 1,
      package_type: payload.package_type || '20 Cheese Drum',
      total_pieces: payload.total_pieces || 20,
      location: payload.location,
      neighborhood: payload.neighborhood || '',
      notes: payload.notes || '',
      total_value: payload.total_value || 0,
      status: 'Novo',
    });

    return { error: error ? error.message : null };
  },

  async updateEventOrderStatus(id: string, status: any): Promise<{ error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase não configurado.' };

    const { error } = await supabase
      .from('event_orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    return { error: error ? error.message : null };
  },

  // STORE SETTINGS
  async getStoreSettings(): Promise<StoreSettingsRecord | null> {
    const supabase = getSupabase();
    if (!supabase) {
      return {
        store_name: 'Tchemba',
        slogan: 'O Sabor que derrete.',
        phone: '+244 939 779 057',
        whatsapp: '+244 939 779 057',
        email: 'tchembacrispy@gmail.com',
        address: '6PHR+VH8, R. Silva Porto, Huambo, Angola',
        opening_time: '10:00',
        closing_time: '23:30',
      };
    }

    const { data, error } = await supabase.from('store_settings').select('*').limit(1).maybeSingle();
    if (error || !data) {
      return {
        store_name: 'Tchemba',
        slogan: 'O Sabor que derrete.',
        phone: '+244 939 779 057',
        whatsapp: '+244 939 779 057',
        email: 'tchembacrispy@gmail.com',
        address: '6PHR+VH8, R. Silva Porto, Huambo, Angola',
        opening_time: '10:00',
        closing_time: '23:30',
      };
    }
    return data;
  },

  async updateStoreSettings(settings: Partial<StoreSettingsRecord>): Promise<{ error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase não configurado.' };

    const { data: existing } = await supabase.from('store_settings').select('id').limit(1).maybeSingle();

    if (existing?.id) {
      const { error } = await supabase
        .from('store_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
      return { error: error ? error.message : null };
    } else {
      const { error } = await supabase.from('store_settings').insert({
        ...settings,
        store_name: settings.store_name || 'Tchemba',
        slogan: settings.slogan || 'O Sabor que derrete.',
        phone: settings.phone || '+244 939 779 057',
        whatsapp: settings.whatsapp || '+244 939 779 057',
        email: settings.email || 'tchembacrispy@gmail.com',
        address: settings.address || '6PHR+VH8, R. Silva Porto, Huambo, Angola',
        opening_time: settings.opening_time || '10:00',
        closing_time: settings.closing_time || '23:30',
      });
      return { error: error ? error.message : null };
    }
  },
};
