import React, { useState } from 'react';
import { PartyPopper, Utensils, MessageCircle, ShoppingBag, Check, Phone } from 'lucide-react';
import { Product } from '../types';

interface EventsBannerProps {
  onAddEventPackage: (packageId?: string) => void;
  addedProductId?: string | null;
}

export const EventsBanner: React.FC<EventsBannerProps> = ({
  onAddEventPackage,
  addedProductId,
}) => {
  const [selectedTier, setSelectedTier] = useState<'20' | '30' | '40' | '50'>('20');

  const packages = [
    {
      id: 'producao-eventos-20',
      count: '20',
      pieces: '20 Cheese Drum',
      price: '18.100 Kz',
      recommended: 'Grupos de 6 a 10 pessoas',
    },
    {
      id: 'producao-eventos-30',
      count: '30',
      pieces: '30 Cheese Drum',
      price: '27.500 Kz',
      recommended: 'Grupos de 10 a 15 pessoas',
    },
    {
      id: 'producao-eventos-40',
      count: '40',
      pieces: '40 Cheese Drum',
      price: '36.600 Kz',
      recommended: 'Festas & Reuniões Médias',
    },
    {
      id: 'producao-eventos-50',
      count: '50',
      pieces: '50 Cheese Drum',
      price: '46.000 Kz',
      recommended: 'Grandes Eventos & Celebrações',
    },
  ];

  const currentPkg = packages.find((p) => p.count === selectedTier) || packages[0];
  const isCurrentAdded = addedProductId === currentPkg.id;

  return (
    <section id="eventos" className="w-full px-4 sm:px-6 lg:px-12 py-16 sm:py-20 bg-[#131313] scroll-mt-20">
      <div className="max-w-7xl mx-auto rounded-3xl bg-[#1c1b1b] border border-[#2a2a2a] overflow-hidden shadow-2xl relative">
        {/* Background Image with Deep Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            alt="Tchemba Crispy Venda para Eventos"
            className="w-full h-full object-cover object-center opacity-25 filter blur-[2px] scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_q0cqkESr5uOfLL0knJ2VGA6X_NjA2MeXdenbtUI4TVE247m7E51Rl4NihjXtrmTV3qMiydmAAmcRXikG9xidOVNY_VyMU0vRZToA6oJkXYUwInRabZyCHw3dCn3-AI50_tOF9RuZ6au-7yvspuco3mLhce8wySauAUTZrUTt9Sdzu1d3hTgXnyhu2EHoNyOCMfTl2SCnbwqnVnpSHE1VTWenOUbfGhJ4-XfPzoIayFg20RPp_KA71Q"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/90 to-[#131313]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#d32f2f]/10 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 p-6 sm:p-10 lg:p-14">
          {/* Left Text and Pricing Tiers */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ee9800]/20 text-[#ffb95f] border border-[#ee9800]/30 w-fit backdrop-blur-md">
              <PartyPopper className="w-4 h-4 text-[#ffb95f]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Catering & Grandes Pedidos
              </span>
            </div>

            <div>
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#ffb95f] block mb-1">
                TCHEMBA CRISPY
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                Venda para Eventos & Aniversários
              </h2>
              <p className="text-sm sm:text-base text-[#e4beba]/90 leading-relaxed mt-2 max-w-xl">
                Produção especial em grande escala no Huambo. Cheese Drums super estaladiços por fora com queijo derretido e fumegante por dentro, feitos na hora e entregues quentes no seu evento.
              </p>
            </div>

            {/* Price Tiers Grid (from the official flyer) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {packages.map((pkg) => {
                const isSelected = selectedTier === pkg.count;
                return (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedTier(pkg.count as any)}
                    className={`flex flex-col items-start p-3 sm:p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-[#ffb95f] text-[#2c1800] border-[#ffb95f] shadow-lg shadow-[#ffb95f]/20 scale-[1.02]'
                        : 'bg-[#201f1f]/80 hover:bg-[#2a2a2a] text-white border-[#353534] backdrop-blur-sm'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider ${
                        isSelected ? 'text-[#472a00]' : 'text-[#ab8985]'
                      }`}
                    >
                      {pkg.pieces}
                    </span>
                    <span
                      className={`font-heading text-base sm:text-lg font-black mt-1 ${
                        isSelected ? 'text-[#201000]' : 'text-[#ffb95f]'
                      }`}
                    >
                      {pkg.price}
                    </span>
                    <span
                      className={`text-[10px] font-medium mt-1 leading-tight ${
                        isSelected ? 'text-[#472a00]' : 'text-[#ab8985]'
                      }`}
                    >
                      {pkg.recommended}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Package Details Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#201f1f]/90 border border-[#353534] flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#d32f2f]/20 border border-[#d32f2f]/40 flex items-center justify-center text-[#ffb3ac] shrink-0">
                  <Utensils className="w-6 h-6 text-[#d32f2f]" />
                </div>
                <div>
                  <span className="font-heading text-base sm:text-lg font-bold text-white block">
                    Bandeja {currentPkg.pieces}
                  </span>
                  <span className="text-xs text-[#ab8985]">
                    Produção fresca por encomenda • Entrega pontual no Huambo
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] text-[#ab8985] uppercase tracking-wider font-semibold block">
                  Valor Promocional
                </span>
                <span className="font-heading text-xl sm:text-2xl font-black text-[#ffb95f]">
                  {currentPkg.price}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href={`https://wa.me/244939779057?text=Ol%C3%A1%2C%20Tchemba.%20Gostaria%20de%20fazer%20uma%20encomenda%20para%20evento%20de%20${encodeURIComponent(currentPkg.pieces)}%20(${currentPkg.price}).`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs sm:text-sm tracking-wider shadow-lg shadow-[#d32f2f]/30 transition-all active:scale-98 cursor-pointer whitespace-nowrap"
              >
                <MessageCircle className="w-5 h-5" />
                <span>ENCOMENDAR PELO WHATSAPP</span>
              </a>

              <button
                onClick={() => onAddEventPackage(currentPkg.id)}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer whitespace-nowrap ${
                  isCurrentAdded
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-[#2a2a2a] hover:bg-[#353534] text-white border-[#353534]'
                }`}
              >
                {isCurrentAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Adicionado ao Carrinho</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-[#ffb95f]" />
                    <span>Adicionar ao Carrinho</span>
                  </>
                )}
              </button>

              <div className="inline-flex items-center gap-1.5 text-xs text-[#ffb95f] font-semibold">
                <Phone className="w-4 h-4" />
                <span>939 779 057</span>
              </div>
            </div>
          </div>

          {/* Right Visual Tray Showcase (Never cut or cropped awkwardly) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden border border-[#353534] bg-[#0e0e0e] shadow-2xl group">
              <div className="aspect-[4/3] sm:aspect-square w-full relative overflow-hidden">
                <img
                  alt="Bandeja de Cheese Drums Tchemba Crispy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_q0cqkESr5uOfLL0knJ2VGA6X_NjA2MeXdenbtUI4TVE247m7E51Rl4NihjXtrmTV3qMiydmAAmcRXikG9xidOVNY_VyMU0vRZToA6oJkXYUwInRabZyCHw3dCn3-AI50_tOF9RuZ6au-7yvspuco3mLhce8wySauAUTZrUTt9Sdzu1d3hTgXnyhu2EHoNyOCMfTl2SCnbwqnVnpSHE1VTWenOUbfGhJ4-XfPzoIayFg20RPp_KA71Q"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />
              </div>

              {/* Float badge on image */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-[#1c1b1b]/90 border border-[#2a2a2a] backdrop-blur-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#ffb95f] font-bold uppercase tracking-wider block">
                    Tchemba Crispy
                  </span>
                  <span className="text-xs font-bold text-white">
                    Cheese Drums Crocantes
                  </span>
                </div>
                <span className="text-xs font-extrabold text-[#ffb95f] px-2.5 py-1 rounded-full bg-[#ffb95f]/15 border border-[#ffb95f]/30">
                  Sob Encomenda
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
