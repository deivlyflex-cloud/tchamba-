import React from 'react';
import { Product } from '../types';
import { FORMAT_KZ, getProductImage } from '../data/products';
import { Plus, ArrowRight, Check } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onViewAllMenu: () => void;
  addedProductId?: string | null;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onAddToCart,
  onViewAllMenu,
  addedProductId,
}) => {
  const featured = products.filter((p) => p.isFeatured);

  return (
    <section id="mais-pedidos" className="w-full px-4 sm:px-6 lg:px-12 py-16 sm:py-20 bg-[#131313]">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 sm:gap-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1 w-6 bg-[#d32f2f] rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#ffb95f]">
                Seleção Exclusiva
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              Os mais pedidos
            </h2>
            <p className="text-sm text-[#e4beba]/80 mt-1">
              Conheça alguns dos favoritos indiscutíveis da Tchemba no Huambo.
            </p>
          </div>

          <button
            onClick={onViewAllMenu}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#ffb95f] hover:text-[#ffdeac] transition-colors cursor-pointer group"
          >
            <span>Ver cardápio completo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid of 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((item) => {
            const isJustAdded = addedProductId === item.id;
            return (
              <div
                key={item.id}
                className="group relative flex flex-col bg-[#201f1f] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/70 hover:border-[#353534]"
              >
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden bg-[#0e0e0e]">
                  <img
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={getProductImage(item, item.image)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#201f1f] via-transparent to-transparent" />

                  {/* Badge */}
                  {item.badge && (
                    <span
                      className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                        item.badgeType === 'top'
                          ? 'bg-[#d32f2f] text-white'
                          : item.badgeType === 'favorito'
                          ? 'bg-[#ffb95f] text-[#472a00]'
                          : 'bg-[#ee9800] text-[#472a00]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#ffb95f] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#ab8985] mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#2a2a2a]/60">
                    <div>
                      <span className="text-[10px] text-[#ab8985] uppercase tracking-wider block font-semibold">
                        Preço
                      </span>
                      <span className="font-heading text-lg text-[#ffb95f] font-extrabold">
                        {FORMAT_KZ(item.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => onAddToCart(item)}
                      aria-label={`Adicionar ${item.name}`}
                      className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-md cursor-pointer whitespace-nowrap ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#d32f2f] hover:bg-[#b71c1c] text-white shadow-[0_0_15px_rgba(211,47,47,0.35)]'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Adicionado</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                          <span>Adicionar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
