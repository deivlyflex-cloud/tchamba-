import { getSupabase } from './supabase';
import { Product, OrderRecord, OrderStatus, CategoryRecord, CustomerRecord, EventOrderRecord, StoreSettingsRecord } from '../types';
import { INITIAL_PRODUCTS, getProductImage } from '../data/products';

// Helper to map DB row to frontend Product
export const mapDbProductToProduct = (p: any): Product => {
  const catSlug = (p.category?.slug || p.category_slug || '').toLowerCase();
  const catName = (p.category?.name || '').toLowerCase();

  let category: any = 'Combos';
  if (catSlug === 'cheese-drums' || catName.includes('cheese')) {
    category = 'Cheese Drums';
  } else if (catSlug === 'acompanhamentos' || catName.includes('acompanha')) {
    category = 'Acompanhamentos';
  } else if (catSlug === 'bebidas' || catName.includes('bebida')) {
    category = 'Bebidas';
  } else if (catSlug === 'eventos' || catName.includes('evento')) {
    category = 'Eventos';
  } else {
    category = 'Combos';
  }

  // Resolve genuine photo: authentic drinks, fries, specific combos, or custom upload
  const resolvedImage = getProductImage(
    {
      id: p.id,
      name: p.name,
      category,
      image: p.image_url,
    },
    p.image_url
  );

  return {
    id: p.id,
    name: p.name,
    description: p.description || '',
    price: Number(p.price) || 0,
    category,
    image: resolvedImage,
    badge: p.badge || undefined,
    badgeType: p.badge_type || undefined,
    pieces: p.pieces || undefined,
    isConsultation: Boolean(p.is_consultation),
    isFeatured: Boolean(p.is_featured),
    isActive: p.is_active !== false,
  };
};

export const dbService = {
  // PRODUCTS
  async getProducts(onlyActive = true): Promise<Product[]> {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('[dbService] Supabase not configured, using fallback products');
      return onlyActive ? INITIAL_PRODUCTS.filter((p) => p.isActive !== false) : INITIAL_PRODUCTS;
    }

    try {
      let query = supabase
        .from('products')
        .select('*, category:categories(id, name, slug)')
        .order('created_at', { ascending: true });

      if (onlyActive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) {
        console.error('[dbService] Error fetching products from Supabase:', error.message);
        return onlyActive ? INITIAL_PRODUCTS.filter((p) => p.isActive !== false) : INITIAL_PRODUCTS;
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map(mapDbProductToProduct);
    } catch (err: any) {
      console.error('[dbService] Exception in getProducts:', err);
      return onlyActive ? INITIAL_PRODUCTS.filter((p) => p.isActive !== false) : INITIAL_PRODUCTS;
    }
  },

  async createProduct(productData: Partial<Product> & { category_id?: string }): Promise<{ data: any; error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: 'Cliente Supabase não inicializado.' };

    try {
      // Resolve category_id if not provided
      let categoryId = productData.category_id;
      if (!categoryId && productData.category) {
        const categories = await this.getCategories();
        const found = categories.find(
          (c) =>
            c.name.toLowerCase() === (productData.category || '').toLowerCase() ||
            c.slug.toLowerCase() === (productData.category || '').toLowerCase().replace(/\s+/g, '-')
        );
        if (found) categoryId = found.id;
      }

      // Exact database columns for 'products' table in Supabase
      const payload: Record<string, any> = {
        name: (productData.name || '').trim(),
        description: (productData.description || '').trim(),
        price: Number(productData.price) || 0,
        image_url: productData.image?.trim() || null,
        is_featured: Boolean(productData.isFeatured),
        is_active: productData.isActive !== false,
      };

      if (categoryId) {
        payload.category_id = categoryId;
      }

      console.log('[Supabase] Inserting into products:', payload);
      const { data, error } = await supabase.from('products').insert(payload).select('*, category:categories(id, name, slug)').single();

      if (error) {
        console.error('[Supabase] Insert product error:', error);
        return { data: null, error: `Erro no Supabase ao criar produto: ${error.message}` };
      }

      console.log('[Supabase] Successfully created product:', data);
      return { data, error: null };
    } catch (err: any) {
      console.error('[Supabase] Exception creating product:', err);
      return { data: null, error: err.message || 'Erro inesperado ao criar produto.' };
    }
  },

  async updateProduct(id: string, productData: Partial<Product> & { category_id?: string }): Promise<{ error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Cliente Supabase não inicializado.' };

    try {
      const payload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (productData.name !== undefined) payload.name = productData.name.trim();
      if (productData.description !== undefined) payload.description = productData.description.trim();
      if (productData.price !== undefined) payload.price = Number(productData.price) || 0;
      if (productData.image !== undefined) payload.image_url = productData.image?.trim() || null;
      if (productData.isFeatured !== undefined) payload.is_featured = Boolean(productData.isFeatured);
      if (productData.isActive !== undefined) payload.is_active = Boolean(productData.isActive);

      if (productData.category_id) {
        payload.category_id = productData.category_id;
      } else if (productData.category) {
        const categories = await this.getCategories();
        const found = categories.find(
          (c) =>
            c.name.toLowerCase() === (productData.category || '').toLowerCase() ||
            c.slug.toLowerCase() === (productData.category || '').toLowerCase().replace(/\s+/g, '-')
        );
        if (found) payload.category_id = found.id;
      }

      console.log('[Supabase] Updating product ID:', id, 'payload:', payload);
      const { data, error } = await supabase.from('products').update(payload).eq('id', id).select();

      if (error) {
        console.error('[Supabase] Update product error:', error);
        return { error: `Erro no Supabase ao atualizar produto: ${error.message}` };
      }

      if (!data || data.length === 0) {
        console.warn('[Supabase] 0 rows updated for product ID:', id);
        return { error: 'Nenhuma alteração foi gravada. Verifique se o produto existe no Supabase e se o seu login de administrador está ativo.' };
      }

      console.log('[Supabase] Successfully updated product:', data[0]);
      return { error: null };
    } catch (err: any) {
      console.error('[Supabase] Exception updating product:', err);
      return { error: err.message || 'Erro inesperado ao atualizar produto.' };
    }
  },

  async deleteProduct(id: string): Promise<{ error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Cliente Supabase não inicializado.' };

    try {
      console.log('[Supabase] Deleting product ID:', id);
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        console.error('[Supabase] Delete error:', error);
        return { error: `Erro no Supabase ao excluir: ${error.message}` };
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Erro ao excluir produto.' };
    }
  },

  // IMAGE UPLOAD VIA SUPABASE STORAGE
  async uploadProductImage(file: File): Promise<{ url: string | null; error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { url: null, error: 'Cliente Supabase não inicializado.' };

    try {
      console.log('[Supabase Storage] Starting image upload:', file.name, 'Size:', file.size, 'Type:', file.type);
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanExt = ['jpg', 'jpeg', 'png', 'webp'].includes(fileExt) ? fileExt : 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;
      const filePath = `products/${fileName}`;
      const mimeType = file.type || `image/${cleanExt === 'jpg' ? 'jpeg' : cleanExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: mimeType,
        });

      if (uploadError) {
        console.error('[Supabase Storage] Upload error:', uploadError);
        return {
          url: null,
          error: `Erro ao enviar imagem para o Supabase Storage: ${uploadError.message}. Verifique as permissões de acesso da sessão.`,
        };
      }

      console.log('[Supabase Storage] File uploaded successfully:', uploadData);

      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);

      if (!urlData || !urlData.publicUrl) {
        return { url: null, error: 'Não foi possível gerar a URL pública da imagem enviada.' };
      }

      console.log('[Supabase Storage] Public URL generated:', urlData.publicUrl);
      return { url: urlData.publicUrl, error: null };
    } catch (e: any) {
      console.error('[Supabase Storage] Upload exception:', e);
      return { url: null, error: e.message || 'Falha ao carregar imagem no storage.' };
    }
  },

  // CATEGORIES
  async getCategories(): Promise<CategoryRecord[]> {
    const supabase = getSupabase();
    if (!supabase) {
      return [
        { id: 'acb9bd5b-303d-4a98-93e5-0728bf2eed33', name: 'Combos', slug: 'combos', is_active: true, display_order: 1 },
        { id: 'fa09a1a6-650e-444c-b41f-4d9afc93425f', name: 'Cheese Drums', slug: 'cheese-drums', is_active: true, display_order: 2 },
        { id: 'bbaa2b5d-9955-4d36-a165-546fcfa0e0d0', name: 'Acompanhamentos', slug: 'acompanhamentos', is_active: true, display_order: 3 },
        { id: '1589a1f4-c05d-4960-a53f-6dcd649914b3', name: 'Bebidas', slug: 'bebidas', is_active: true, display_order: 4 },
        { id: '8f6c3682-d96b-4c3c-95d3-2099b5c90fbd', name: 'Eventos', slug: 'eventos', is_active: true, display_order: 5 },
      ];
    }

    try {
      const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
      if (error || !data || data.length === 0) {
        return [
          { id: 'acb9bd5b-303d-4a98-93e5-0728bf2eed33', name: 'Combos', slug: 'combos', is_active: true, display_order: 1 },
          { id: 'fa09a1a6-650e-444c-b41f-4d9afc93425f', name: 'Cheese Drums', slug: 'cheese-drums', is_active: true, display_order: 2 },
          { id: 'bbaa2b5d-9955-4d36-a165-546fcfa0e0d0', name: 'Acompanhamentos', slug: 'acompanhamentos', is_active: true, display_order: 3 },
          { id: '1589a1f4-c05d-4960-a53f-6dcd649914b3', name: 'Bebidas', slug: 'bebidas', is_active: true, display_order: 4 },
          { id: '8f6c3682-d96b-4c3c-95d3-2099b5c90fbd', name: 'Eventos', slug: 'eventos', is_active: true, display_order: 5 },
        ];
      }
      return data;
    } catch {
      return [];
    }
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
    customerEmail?: string;
    neighborhood: string;
    deliveryAddress: string;
    notes?: string;
    items: Array<{
      productId?: string;
      productName: string;
      unitPrice: number;
      quantity: number;
    }>;
  }): Promise<{ orderNumber: string; orderId?: string; total?: number; error: string | null }> {
    const supabase = getSupabase();

    const subtotal = params.items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
    const fallbackOrderNumber = `TC-${Date.now().toString().slice(-6)}`;
    const cleanPhone = params.customerPhone.trim();
    const cleanName = params.customerName.trim();
    const cleanAddress = params.deliveryAddress.trim();
    const cleanNeighborhood = params.neighborhood.trim();
    const notes = params.notes?.trim() || '';

    if (!supabase) {
      return { orderNumber: fallbackOrderNumber, total: subtotal, error: null };
    }

    try {
      // 1. Primary path: Supabase RPC 'create_order'
      console.log('[Supabase] Executing create_order RPC...');
      const rpcItems = params.items.map((it) => ({
        product_id: it.productId || null,
        product_name: it.productName,
        quantity: it.quantity,
        unit_price: it.unitPrice,
      }));

      const { data: rpcData, error: rpcError } = await supabase.rpc('create_order', {
        p_customer_name: cleanName,
        p_customer_phone: cleanPhone,
        p_customer_email: params.customerEmail || null,
        p_delivery_address: cleanAddress,
        p_neighborhood: cleanNeighborhood,
        p_notes: notes,
        p_items: rpcItems,
      });

      if (!rpcError && rpcData) {
        console.log('[Supabase] create_order RPC success:', rpcData);
        return {
          orderNumber: rpcData.order_number || fallbackOrderNumber,
          orderId: rpcData.order_id,
          total: Number(rpcData.total) || subtotal,
          error: null,
        };
      }

      if (rpcError) {
        console.warn('[Supabase] RPC create_order returned error, attempting fallback insert:', rpcError.message);
      }

      // 2. Fallback path: Direct insert if RPC is not present
      let customerId: string | undefined = undefined;

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
            name: cleanName,
            address: cleanAddress,
            neighborhood: cleanNeighborhood,
            total_orders: (existingCustomer.total_orders || 0) + 1,
            total_spent: Number(existingCustomer.total_spent || 0) + subtotal,
            last_order_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', customerId);
      } else {
        const { data: newCustomer } = await supabase
          .from('customers')
          .insert({
            name: cleanName,
            phone: cleanPhone,
            address: cleanAddress,
            neighborhood: cleanNeighborhood,
            total_orders: 1,
            total_spent: subtotal,
            last_order_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (newCustomer) customerId = newCustomer.id;
      }

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: fallbackOrderNumber,
          customer_id: customerId,
          customer_name: cleanName,
          customer_phone: cleanPhone,
          delivery_address: cleanAddress,
          neighborhood: cleanNeighborhood,
          notes,
          status: 'Novo',
          subtotal,
          total: subtotal,
        })
        .select('id')
        .single();

      if (orderError) {
        return { orderNumber: fallbackOrderNumber, total: subtotal, error: orderError.message };
      }

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

      return { orderNumber: fallbackOrderNumber, orderId: orderData?.id, total: subtotal, error: null };
    } catch (err: any) {
      console.error('[Supabase] Error creating order:', err);
      return { orderNumber: fallbackOrderNumber, total: subtotal, error: err.message || 'Erro ao processar pedido' };
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
