import React, { useState } from 'react';
import { Product, Category } from '../types';
import { FORMAT_KZ } from '../data/products';
import {
  BookOpen,
  Sliders,
  Plus,
  Check,
  Search,
  MessageCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface MenuSectionProps {
  products: Product[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  onAddToCart: (product: Product) => void;
  onOpenAdminModal: () => void;
  onConsultFrango: () => void;
  addedProductId?: string | null;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  onOpenAdminModal,
  onConsultFrango,
  addedProductId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories: Category[] = [
    'Todos',
    'Combos',
    'Cheese Drums',
    'Acompanhamentos',
    'Bebidas',
    'Eventos',
  ];

  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="cardapio"
      className="w-full px-4 sm:px-6 lg:px-12 py-16 sm:py-20 bg-[#0e0e0e] scroll-mt-20 border-t border-[#1c1b1b]"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-8 sm:gap-10">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-[#ffb3ac]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#ffb3ac]">
                Cardápio Oficial
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              O Nosso Cardápio
            </h2>
            <p className="text-sm text-[#e4beba]/80 mt-1">
              Selecione uma categoria e adicione ao seu pedido com apenas um clique.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search bar */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-[#ab8985] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Pesquisar sabor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#1c1b1b] border border-[#2a2a2a] rounded-full text-white placeholder-[#ab8985] focus:outline-none focus:border-[#ffb95f]"
              />
            </div>

            {/* Quick Price Adjuster Trigger */}
            <button
              onClick={onOpenAdminModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#353534] text-[#e4beba] hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-[#ffb95f]" />
              <span>Ajustar Preços / Frango</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#ffb95f] text-[#472a00] font-bold shadow-md shadow-[#ffb95f]/20 scale-105'
                    : 'bg-[#201f1f] border border-[#2a2a2a] text-[#e4beba]/90 hover:text-white hover:bg-[#2a2a2a]'
                }`}
              >
                {cat === 'Todos' ? 'Todos os Produtos' : cat}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-[#ab8985] flex flex-col items-center gap-2 bg-[#1c1b1b] rounded-2xl border border-[#2a2a2a]">
            <Search className="w-10 h-10 text-[#353534]" />
            <p className="text-sm font-semibold">Nenhum produto encontrado nesta categoria.</p>
            <button
              onClick={() => {
                onSelectCategory('Todos');
                setSearchQuery('');
              }}
              className="text-xs text-[#ffb95f] hover:underline mt-1 font-bold"
            >
              Limpar filtros e ver todos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isEvent = product.category === 'Eventos';
              const isJustAdded = addedProductId === product.id;

              return (
                <div
                  key={product.id}
                  className={`product-item flex flex-col bg-[#201f1f] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-md group transition-all duration-300 hover:border-[#353534] hover:shadow-xl ${
                    isEvent ? 'md:col-span-2 lg:col-span-2' : ''
                  }`}
                >
                  {/* Photo with overlay */}
                  <div
                    className={`relative w-full overflow-hidden bg-[#0e0e0e] ${
                      isEvent ? 'h-52 sm:h-60' : 'h-48 sm:h-52'
                    }`}
                  >
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={product.image}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#201f1f] via-transparent to-transparent" />

                    {/* Badge top-left */}
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#2a2a2a]/95 text-[#ffb95f] text-[11px] font-bold uppercase tracking-wider border border-[#353534] shadow-sm">
                        {product.badge}
                      </span>
                    )}

                    {product.pieces && (
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#ee9800]/25 text-[#ffb95f] text-xs font-bold border border-[#ee9800]/40 backdrop-blur-sm">
                        {product.pieces}
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#ffb95f] transition-colors">
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[#ab8985] mt-1.5 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Footer price & CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]/70">
                      <div>
                        <span className="text-[10px] text-[#ab8985] uppercase tracking-wider block font-semibold">
                          {product.isConsultation && product.price === 0 ? 'Valor' : 'Preço'}
                        </span>
                        <span className="font-heading text-lg text-[#ffb95f] font-extrabold">
                          {product.isConsultation && product.price === 0
                            ? 'Sob Consulta'
                            : FORMAT_KZ(product.price)}
                        </span>
                      </div>

                      {product.isConsultation && product.price === 0 ? (
                        <button
                          onClick={onConsultFrango}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2a2a2a] hover:bg-[#353534] text-white text-xs font-bold uppercase tracking-wider transition-transform active:scale-95 cursor-pointer border border-[#353534]"
                        >
                          <HelpCircle className="w-4 h-4 text-[#ffb95f]" />
                          <span>Consultar</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onAddToCart(product)}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-md cursor-pointer ${
                              isJustAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#d32f2f] hover:bg-[#b71c1c] text-white shadow-[0_0_15px_rgba(211,47,47,0.3)]'
                            }`}
                          >
                            {isJustAdded ? (
                              <>
                                <Check className="w-4 h-4" />
                                <span>Adicionado</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                <span>Adicionar</span>
                              </>
                            )}
                          </button>

                          {isEvent && (
                            <a
                              href="https://wa.me/244939779057?text=Ol%C3%A1%2C%20Tchemba.%20Tenho%20interesse%20na%20produ%C3%A7%C3%A3o%20para%20eventos%20de%2020%20Cheese%20Drums."
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-[#2a2a2a] hover:bg-[#353534] text-white text-xs font-bold border border-[#353534] transition-colors"
                            >
                              <MessageCircle className="w-4 h-4 text-[#ffb95f]" />
                              <span>Agendar</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
