import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { getSupabase } from '../lib/supabase';
import { OrderRecord } from '../types';
import { DashboardView } from './DashboardView';
import { OrdersView } from './OrdersView';
import { ProductsView } from './ProductsView';
import { CategoriesView } from './CategoriesView';
import { CustomersView } from './CustomersView';
import { ReportsView } from './ReportsView';
import { EventsView } from './EventsView';
import { SettingsView } from './SettingsView';
import { AdminsView } from './AdminsView';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Layers,
  Users,
  BarChart3,
  Calendar,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  Bell,
  ArrowUpRight,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'pedidos'
  | 'produtos'
  | 'categorias'
  | 'clientes'
  | 'relatorios'
  | 'eventos'
  | 'configuracoes'
  | 'administradores';

interface AdminDashboardProps {
  initialTab?: AdminTab;
  onNavigateToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'dashboard', onNavigateToStore }) => {
  const { user, signOut } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<OrderRecord | null>(null);
  const [newOrderNotification, setNewOrderNotification] = useState<string | null>(null);

  // Sync route URL hash or path smoothly
  const handleTabChange = (tab: AdminTab) => {
    setCurrentTab(tab);
    window.location.hash = `/adm/${tab}`;
    setMobileMenuOpen(false);
  };

  // Realtime subscription to new orders on Supabase
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    const channel = supabase
      .channel('admin_orders_channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const newOrder = payload.new as OrderRecord;
          setNewOrderNotification(`Novo pedido recebido: ${newOrder.order_number}`);
          setTimeout(() => setNewOrderNotification(null), 8000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    window.location.hash = '/adm';
  };

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pedidos' as AdminTab, label: 'Pedidos', icon: ShoppingBag },
    { id: 'produtos' as AdminTab, label: 'Produtos', icon: UtensilsCrossed },
    { id: 'categorias' as AdminTab, label: 'Categorias', icon: Layers },
    { id: 'clientes' as AdminTab, label: 'Clientes', icon: Users },
    { id: 'relatorios' as AdminTab, label: 'Relatórios', icon: BarChart3 },
    { id: 'eventos' as AdminTab, label: 'Eventos', icon: Calendar },
    { id: 'configuracoes' as AdminTab, label: 'Configurações', icon: Settings },
    { id: 'administradores' as AdminTab, label: 'Administradores', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#131313] text-[#fbf8f5] flex flex-col md:flex-row antialiased selection:bg-[#d32f2f] selection:text-white">
      {/* Realtime Notification Banner */}
      {newOrderNotification && (
        <div className="fixed top-4 right-4 z-50 bg-[#d32f2f] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-400/30 animate-bounce">
          <Bell className="w-5 h-5 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-wider">Novo Pedido Recebido</span>
            <span className="text-xs font-medium">{newOrderNotification}</span>
          </div>
          <button
            onClick={() => {
              setNewOrderNotification(null);
              handleTabChange('pedidos');
            }}
            className="ml-3 px-2.5 py-1 rounded-lg bg-black/30 hover:bg-black/50 text-[11px] font-bold cursor-pointer"
          >
            Ver
          </button>
        </div>
      )}

      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1c1b1b] border-r border-[#2a2a2a] shrink-0 justify-between">
        <div className="p-6">
          {/* Logo / Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#d32f2f] flex items-center justify-center font-heading font-black text-lg text-white shadow-md shadow-[#d32f2f]/30">
              T
            </div>
            <div>
              <span className="font-heading font-black text-sm uppercase tracking-wider text-white block">
                TCHEMBA ADMIN
              </span>
              <span className="text-[10px] text-[#ab8985] font-semibold block">
                Painel Administrativo
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#d32f2f] text-white shadow-md shadow-[#d32f2f]/20'
                      : 'text-[#ab8985] hover:bg-[#201f1f] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User & Logout */}
        <div className="p-6 border-t border-[#2a2a2a] flex flex-col gap-3">
          <button
            onClick={onNavigateToStore}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#131313] hover:bg-[#201f1f] text-[#ab8985] hover:text-white text-xs font-semibold border border-[#2a2a2a] transition-colors cursor-pointer"
          >
            <span>Ver Site Público</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 text-xs font-bold transition-colors cursor-pointer border border-red-900/30"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER */}
      <div className="md:hidden bg-[#1c1b1b] border-b border-[#2a2a2a] p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#d32f2f] flex items-center justify-center font-heading font-black text-sm text-white">
            T
          </div>
          <span className="font-heading font-black text-sm uppercase tracking-wider text-white">
            TCHEMBA ADMIN
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-[#2a2a2a] text-white cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] z-50 bg-[#131313] p-5 flex flex-col justify-between border-t border-[#2a2a2a] overflow-y-auto">
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-left cursor-pointer ${
                    isActive ? 'bg-[#d32f2f] text-white' : 'text-[#ab8985] hover:bg-[#1c1b1b]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-[#2a2a2a] flex flex-col gap-3">
            <button
              onClick={onNavigateToStore}
              className="w-full py-3 rounded-xl bg-[#1c1b1b] text-center text-xs font-bold text-white border border-[#2a2a2a]"
            >
              Voltar ao Site Público
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-red-950/40 text-center text-xs font-bold text-red-400 border border-red-900/40"
            >
              Sair
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Desktop Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#1c1b1b] border-b border-[#2a2a2a]">
          <div>
            <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-white">
              TCHEMBA ADMIN
            </span>
            <span className="text-xs text-[#ab8985] ml-3">
              Administrador: {user?.email || 'tchembacrispy@gmail.com'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2a2a2a] hover:bg-[#353534] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </header>

        {/* Tab View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigateToOrders={() => handleTabChange('pedidos')}
              onSelectOrder={(order) => {
                setSelectedOrderForDetails(order);
                handleTabChange('pedidos');
              }}
            />
          )}

          {currentTab === 'pedidos' && (
            <OrdersView
              selectedOrder={selectedOrderForDetails}
              onClearSelectedOrder={() => setSelectedOrderForDetails(null)}
            />
          )}

          {currentTab === 'produtos' && <ProductsView />}

          {currentTab === 'categorias' && <CategoriesView />}

          {currentTab === 'clientes' && <CustomersView />}

          {currentTab === 'relatorios' && <ReportsView />}

          {currentTab === 'eventos' && <EventsView />}

          {currentTab === 'configuracoes' && <SettingsView />}

          {currentTab === 'administradores' && <AdminsView />}
        </main>
      </div>
    </div>
  );
};
