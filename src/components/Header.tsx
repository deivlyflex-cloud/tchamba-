import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Clock, Flame } from 'lucide-react';
import { useStoreStatus } from '../lib/storeHours';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onNavigate,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isOpen: isOpenNow, badgeText, openingTime, closingTime } = useStoreStatus();

  const navItems = [
    { id: 'inicio', label: 'Início' },
    { id: 'mais-pedidos', label: 'Mais Pedidos' },
    { id: 'cardapio', label: 'Cardápio' },
    { id: 'eventos', label: 'Eventos' },
    { id: 'como-pedir', label: 'Como Pedir' },
    { id: 'localizacao', label: 'Localização' },
    { id: 'contactos', label: 'Contactos' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-[#131313]/90 backdrop-blur-xl border-b border-[#2a2a2a]/60 shadow-[0_4px_20px_rgba(0,0,0,0.45)]">
      <div className="w-full px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="h-20 flex items-center justify-between gap-4">
          {/* Logo & Status */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => handleNavClick('inicio')}
              className="flex items-center gap-3 group text-left cursor-pointer"
            >
              {/* Brand Culinary Emblem */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#d32f2f] via-[#c62828] to-[#ee9800] p-0.5 shadow-[0_0_20px_rgba(211,47,47,0.4)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#1c1b1b] rounded-[14px] flex items-center justify-center overflow-hidden">
                  <Flame className="w-6 h-6 text-[#ffb95f]" />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-xl md:text-2xl tracking-tight text-white group-hover:text-[#ffb95f] transition-colors">
                    TCHEMBA
                  </span>
                </div>
                <span className="text-[11px] text-[#ab8985] tracking-wider uppercase font-medium">
                  O Sabor que derrete
                </span>
              </div>
            </button>

            {/* Operating status badge */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1b1b] border border-[#2a2a2a]">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`}
              />
              <span className="text-xs font-semibold text-white">
                {isOpenNow ? 'Aberto Agora' : 'Fechado'}
              </span>
              <span className="text-xs text-[#ab8985]">10:00 - 23:30</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-[#1c1b1b]/80 border border-[#2a2a2a]">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#2a2a2a] text-white shadow-inner font-bold'
                      : 'text-[#e4beba]/80 hover:text-white hover:bg-[#2a2a2a]/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions: CTA & Cart */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('cardapio')}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs md:text-sm tracking-wider shadow-[0_0_20px_rgba(211,47,47,0.4)] transition-all active:scale-[0.98] cursor-pointer"
            >
              PEDIR AGORA
            </button>

            {/* Cart Button with badge */}
            <button
              onClick={onOpenCart}
              aria-label="Ver Carrinho"
              className="relative flex items-center justify-center w-11 h-11 rounded-full bg-[#2a2a2a] text-white hover:bg-[#353534] transition-all cursor-pointer border border-[#353534]"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-[#ee9800] text-[#472a00] text-[11px] font-extrabold shadow-sm animate-scale">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir Menu"
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full bg-[#2a2a2a] text-white hover:bg-[#353534] transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1a1919] border-b border-[#2a2a2a] px-4 py-5 flex flex-col gap-2 shadow-2xl">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#201f1f] text-xs text-[#e4beba] mb-2">
            <Clock className="w-4 h-4 text-[#ffb95f]" />
            <span>Horário: 10:00 – 23:30 ({isOpenNow ? 'Aberto' : 'Fechado'})</span>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="w-full text-left px-4 py-3 rounded-xl font-semibold text-sm text-[#e4beba] hover:text-white hover:bg-[#2a2a2a] transition-colors"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('cardapio')}
            className="mt-2 w-full py-3 rounded-full bg-[#d32f2f] text-white font-bold text-center text-sm shadow-md"
          >
            VER CARDÁPIO & PEDIR
          </button>
        </div>
      )}
    </header>
  );
};
