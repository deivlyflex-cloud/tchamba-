import React, { useState, useEffect } from 'react';
import { Product, CartItem, Category } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { dbService } from './lib/dbService';
import { AuthProvider } from './lib/AuthContext';
import { AdminRouter } from './admin/AdminRouter';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedProducts } from './components/FeaturedProducts';
import { MenuSection } from './components/MenuSection';
import { EventsBanner } from './components/EventsBanner';
import { HowToOrder } from './components/HowToOrder';
import { LocationHours } from './components/LocationHours';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { FloatingCart } from './components/FloatingCart';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { CheckCircle2 } from 'lucide-react';

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn('Storage read restricted', e);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('Storage write restricted', e);
    }
  },
};

export default function App() {
  // Check if current route is administrative (/adm or #/adm)
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname;
    const hash = window.location.hash;
    return path.startsWith('/adm') || hash.startsWith('#/adm');
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      setIsAdminRoute(path.startsWith('/adm') || hash.startsWith('#/adm'));
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Load live products from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    dbService.getProducts(true).then((dbProducts) => {
      if (isMounted && dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts);
      }
    }).catch((err) => {
      console.warn('Error loading products from Supabase, using initial products:', err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = safeStorage.getItem('tchemba_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading cart', e);
      }
    }
    return [];
  });

  const [selectedCategory, setSelectedCategory] = useState<Category>('Todos');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('inicio');

  // Save cart to local storage
  useEffect(() => {
    safeStorage.setItem('tchemba_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1200);

    showToast(`"${product.name}" adicionado ao seu pedido!`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderCompleted = () => {
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    showToast('Pedido registado e enviado para o WhatsApp!');
  };

  const handleConsultFrango = () => {
    const text = encodeURIComponent(
      'Olá, Tchemba! Gostaria de saber o valor atual e disponibilidade do Frango Artesanal.'
    );
    window.open(`https://wa.me/244939779057?text=${text}`, '_blank');
  };

  const handleAddEventPackage = (packageId?: string) => {
    const targetId = packageId || 'producao-eventos-20';
    const eventProduct = products.find((p) => p.id === targetId || p.name.includes('20 Cheese Drums'));
    if (eventProduct) {
      handleAddToCart(eventProduct);
    } else if (products[0]) {
      handleAddToCart(products[0]);
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll listener to update active section
  useEffect(() => {
    const sections = [
      'inicio',
      'mais-pedidos',
      'cardapio',
      'eventos',
      'como-pedir',
      'localizacao',
      'contactos',
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // If on /adm route, display the full authenticated admin suite
  if (isAdminRoute) {
    return (
      <AuthProvider>
        <AdminRouter
          onBackToStore={() => {
            window.location.hash = '';
            window.history.pushState({}, '', '/');
            setIsAdminRoute(false);
          }}
        />
      </AuthProvider>
    );
  }

  // Otherwise render the public storefront
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex flex-col font-sans selection:bg-[#d32f2f] selection:text-white">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-24 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#201f1f] border border-[#ffb95f]/50 text-white shadow-2xl animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-[#ffb95f]" />
            <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Main Header Navigation */}
        <Header
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onNavigate={scrollToSection}
          activeSection={activeSection}
        />

        <main className="flex-1 flex flex-col">
          {/* 1. Hero Section */}
          <Hero
            onExploreMenu={() => scrollToSection('cardapio')}
            onFilterCombos={() => {
              setSelectedCategory('Combos');
              scrollToSection('cardapio');
            }}
          />

          {/* 2. Featured: Os Mais Pedidos */}
          <FeaturedProducts
            products={products}
            onAddToCart={handleAddToCart}
            onViewAllMenu={() => scrollToSection('cardapio')}
            addedProductId={addedProductId}
          />

          {/* 3. Interactive Menu Section */}
          <MenuSection
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddToCart={handleAddToCart}
            onOpenAdminModal={() => {
              window.location.hash = '/adm';
              setIsAdminRoute(true);
            }}
            onConsultFrango={handleConsultFrango}
            addedProductId={addedProductId}
          />

          {/* 4. Events & Catering Banner */}
          <EventsBanner
            onAddEventPackage={handleAddEventPackage}
            addedProductId={addedProductId}
          />

          {/* 5. How to Order: 5-step guide */}
          <HowToOrder />

          {/* 6. Location, Business Hours & Contacts */}
          <LocationHours />
        </main>

        {/* Footer with subtle link to /adm */}
        <Footer onNavigate={scrollToSection} />

        {/* Sliding Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onOpenCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />

        {/* Checkout Direct to WhatsApp Modal */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          items={cart}
          onOrderCompleted={handleOrderCompleted}
        />

        {/* Mobile Floating Cart Summary */}
        <FloatingCart items={cart} onOpenCart={() => setIsCartOpen(true)} />

        {/* Floating WhatsApp quick assistance button */}
        <FloatingWhatsApp />
      </div>
    </AuthProvider>
  );
}
