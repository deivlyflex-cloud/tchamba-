import React from 'react';
import { Utensils, Flame, Clock, MapPin, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreMenu: () => void;
  onFilterCombos: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMenu, onFilterCombos }) => {
  return (
    <section id="inicio" className="relative w-full overflow-hidden bg-[#0e0e0e] pt-20">
      {/* Background Image with layered cinematic gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          alt="Tchemba Crispy Chicken"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-1000 ease-out"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSb0XnS8F7FUyyORfrBGj4CFvB-gUGkvoRdrgmxYS6qxlvQodiFz9tU8JaX3nfGgpiZdPemwt4uUfajhbVi_drOqUd-Etd2hlYOWt6VlzHO8V5qLeU_FFWTiHs3zlXgrN33KqcvEaHeKgaTWveYrHWmfrI7aO6NBeeGgPI0SNHU39ykdtFAtvgS4QNiISXI643yy6FVVPoN9DY3MOnim4Be2YjJRs05ooOXK6TSph5BsmsrQozJNiRNQ"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/65 to-transparent" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 py-16 lg:py-24 max-w-7xl mx-auto flex flex-col justify-center min-h-[78vh]">
        {/* Status Pill */}
        <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2a2a2a]/90 backdrop-blur-md w-fit mb-6 border border-[#353534] shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest text-white whitespace-nowrap">
              Aberto Agora
            </span>
          </div>
          <span className="text-[#ab8985] text-xs">•</span>
          <span className="text-xs font-semibold text-[#ffb95f] tracking-wider flex items-center gap-1 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 inline shrink-0" /> 10:00 – 23:30
          </span>
          <span className="text-[#ab8985] text-xs hidden sm:inline">•</span>
          <span className="text-xs text-[#e4beba] hidden sm:inline-flex items-center gap-1 whitespace-nowrap">
            <MapPin className="w-3.5 h-3.5 inline text-[#ffb95f] shrink-0" /> Huambo, Angola
          </span>
        </div>

        {/* Hero Copy */}
        <div className="max-w-3xl flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="h-1 w-12 bg-[#d32f2f] rounded-full shrink-0" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#ffb95f] whitespace-nowrap">
              Fast-Food Premium do Huambo
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] uppercase">
            <span>TCHEMBA</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb95f] via-[#ffdeac] to-[#ffb3ac] inline-block">
              – O Sabor que derrete
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#e4beba]/90 max-w-2xl leading-relaxed mt-1">
            Cheese Drums crocantes por fora com queijo derretido e fumegante por dentro. Combos generosos, batatas estaladiças e bebidas bem geladas para transformar cada momento numa experiência inesquecível.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onExploreMenu}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-sm tracking-wider shadow-[0_0_25px_rgba(211,47,47,0.4)] transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              <Utensils className="w-5 h-5" />
              <span>VER CARDÁPIO</span>
            </button>

            <button
              onClick={onFilterCombos}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#201f1f] hover:bg-[#2a2a2a] text-[#ffb95f] hover:text-[#ffdeac] transition-all font-bold text-sm tracking-wider border border-[#353534] cursor-pointer whitespace-nowrap"
            >
              <Flame className="w-5 h-5 text-[#ee9800]" />
              <span>PEDIR COMBOS</span>
            </button>
          </div>

          {/* Trust Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 mt-2 max-w-xl w-full">
            <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center bg-[#1c1b1b]/90 border border-[#2a2a2a] backdrop-blur-md px-4 py-3 sm:p-4 rounded-xl shadow-sm">
              <span className="font-heading text-xl sm:text-2xl font-extrabold text-[#ffb95f] shrink-0">
                100%
              </span>
              <span className="text-xs text-[#ab8985] font-semibold text-right sm:text-left sm:mt-1">
                Frango Selecionado
              </span>
            </div>

            <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center bg-[#1c1b1b]/90 border border-[#2a2a2a] backdrop-blur-md px-4 py-3 sm:p-4 rounded-xl shadow-sm">
              <span className="font-heading text-lg sm:text-2xl font-extrabold text-[#ffb3ac] shrink-0">
                Estaladiço
              </span>
              <span className="text-xs text-[#ab8985] font-semibold text-right sm:text-left sm:mt-1">
                Queijo Fundido
              </span>
            </div>

            <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center bg-[#1c1b1b]/90 border border-[#2a2a2a] backdrop-blur-md px-4 py-3 sm:p-4 rounded-xl shadow-sm">
              <span className="font-heading text-xl sm:text-2xl font-extrabold text-white shrink-0">
                30 min
              </span>
              <span className="text-xs text-[#ab8985] font-semibold text-right sm:text-left sm:mt-1">
                Entrega no Huambo
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
