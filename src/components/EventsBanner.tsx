import React from 'react';
import { PartyPopper, Utensils, MessageCircle, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';

interface EventsBannerProps {
  onAddEventPackage: () => void;
  isAdded?: boolean;
}

export const EventsBanner: React.FC<EventsBannerProps> = ({
  onAddEventPackage,
  isAdded,
}) => {
  return (
    <section id="eventos" className="w-full px-4 sm:px-6 lg:px-12 py-16 sm:py-20 bg-[#131313]">
      <div className="max-w-7xl mx-auto rounded-3xl bg-[#201f1f] border border-[#2a2a2a] overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Text and CTA */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-center gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee9800]/20 text-[#ffb95f] border border-[#ee9800]/30 w-fit">
              <PartyPopper className="w-4 h-4 text-[#ffb95f]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Catering & Grandes Pedidos
              </span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              Produção especial para aniversários e eventos
            </h2>

            <p className="text-sm sm:text-base text-[#e4beba]/90 leading-relaxed">
              Vai realizar uma festa, aniversário, reunião da equipa ou outro evento especial no Huambo? A Tchemba prepara encomendas de alta escala com a mesma qualidade artesanal, crocância inigualável e queijo super derretido.
            </p>

            {/* Deal Highlight Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#2a2a2a] border border-[#353534] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#d32f2f]/20 border border-[#d32f2f]/40 flex items-center justify-center text-[#ffb3ac] shrink-0">
                  <Utensils className="w-6 h-6 text-[#d32f2f]" />
                </div>
                <div>
                  <span className="font-heading text-base sm:text-lg font-bold text-white block">
                    Pacote 20 Cheese Drums
                  </span>
                  <span className="text-xs text-[#ab8985]">
                    Perfeito para grupos de 6 a 10 pessoas
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-[#ab8985] uppercase tracking-wider font-semibold block">
                  Valor Especial
                </span>
                <span className="font-heading text-xl sm:text-2xl font-black text-[#ffb95f]">
                  18.100 Kz
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="https://wa.me/244939779057?text=Ol%C3%A1%2C%20Tchemba.%20Tenho%20interesse%20na%20produ%C3%A7%C3%A3o%20para%20eventos%20de%2020%20Cheese%20Drums."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs sm:text-sm tracking-wider shadow-lg shadow-[#d32f2f]/30 transition-all active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>ENCOMENDAR PARA EVENTO</span>
              </a>

              <button
                onClick={onAddEventPackage}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-[#2a2a2a] hover:bg-[#353534] text-white border-[#353534]'
                }`}
              >
                {isAdded ? (
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
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
            <img
              alt="Cheese Drums para Festas"
              className="w-full h-full object-cover object-center"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_q0cqkESr5uOfLL0knJ2VGA6X_NjA2MeXdenbtUI4TVE247m7E51Rl4NihjXtrmTV3qMiydmAAmcRXikG9xidOVNY_VyMU0vRZToA6oJkXYUwInRabZyCHw3dCn3-AI50_tOF9RuZ6au-7yvspuco3mLhce8wySauAUTZrUTt9Sdzu1d3hTgXnyhu2EHoNyOCMfTl2SCnbwqnVnpSHE1VTWenOUbfGhJ4-XfPzoIayFg20RPp_KA71Q"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#201f1f] via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};
