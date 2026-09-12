import React from 'react';
import { Clock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0e0e0e] border-t border-[#201f1f] text-[#ab8985] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
                  TCHEMBA
                </span>
              </div>
              <span className="text-xs text-[#ab8985] tracking-wider uppercase font-medium">
                O Sabor que derrete
              </span>
            </div>

            <p className="text-xs text-[#ab8985] leading-relaxed max-w-sm">
              O fast-food premium do Huambo especializado em Cheese Drums crocantes com queijo derretido, combos generosos e atendimento de excelência.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-[#ffb95f]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Garantia de frescura e qualidade artesanal</span>
            </div>
          </div>

          {/* Quick Links / Navegação */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              Navegação
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-w-xs">
              {[
                { id: 'inicio', label: 'Início' },
                { id: 'mais-pedidos', label: 'Mais Pedidos' },
                { id: 'cardapio', label: 'Cardápio Completo' },
                { id: 'eventos', label: 'Produção para Eventos' },
                { id: 'como-pedir', label: 'Como Pedir' },
                { id: 'localizacao', label: 'Onde Estamos' },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className="text-left text-xs text-[#ab8985] hover:text-white transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Business Hours */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              Horário de Atendimento
            </h4>
            <div className="p-4 rounded-xl bg-[#1a1919] border border-[#2a2a2a] flex flex-col gap-2 max-w-sm">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Clock className="w-4 h-4 text-[#ffb95f]" />
                <span>Segunda a Domingo</span>
              </div>
              <span className="text-sm font-extrabold text-[#ffb95f]">
                10:00 – 23:30
              </span>
              <span className="text-[11px] text-[#ab8985] leading-relaxed">
                Entregas rápidas em todos os bairros urbanos do Huambo.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar centralizado */}
        <div className="pt-8 mt-8 border-t border-[#1c1b1b] flex items-center justify-center text-center text-[11px] text-[#ab8985]">
          <p>© {currentYear} Tchemba Fast-Food. Todos os direitos reservados. Huambo, Angola.</p>
        </div>
      </div>
    </footer>
  );
};
