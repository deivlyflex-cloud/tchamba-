import React from 'react';
import {
  CheckCircle2,
  BookOpen,
  ShoppingCart,
  UserCheck,
  Send,
  Bike,
} from 'lucide-react';

export const HowToOrder: React.FC = () => {
  const steps = [
    {
      step: '1',
      title: 'Escolha os produtos',
      description: 'Navegue pelos combos, cheese drums e bebidas do nosso menu oficial.',
      icon: BookOpen,
      badgeColor: 'bg-[#d32f2f]/20 text-[#ffb3ac] border-[#d32f2f]/30',
    },
    {
      step: '2',
      title: 'Adicione ao carrinho',
      description: 'Clique em adicionar e ajuste as quantidades que deseja receber.',
      icon: ShoppingCart,
      badgeColor: 'bg-[#ee9800]/20 text-[#ffb95f] border-[#ee9800]/30',
    },
    {
      step: '3',
      title: 'Informe os seus dados',
      description: 'Indique o seu nome, contacto telefónico e endereço de entrega no Huambo.',
      icon: UserCheck,
      badgeColor: 'bg-[#d32f2f]/20 text-[#ffb3ac] border-[#d32f2f]/30',
    },
    {
      step: '4',
      title: 'Envie pelo WhatsApp',
      description: 'A sua mensagem já vai estruturada diretamente para a nossa linha de atendimento.',
      icon: Send,
      badgeColor: 'bg-[#ee9800]/20 text-[#ffb95f] border-[#ee9800]/30',
    },
    {
      step: '5',
      title: 'Confirmação & Entrega',
      description: 'A equipa Tchemba confirma o pedido e envia o estafeta com a refeição quentinha.',
      icon: Bike,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <section id="como-pedir" className="w-full px-4 sm:px-6 lg:px-12 py-16 sm:py-20 bg-[#0e0e0e] border-t border-[#1c1b1b]">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 sm:gap-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee9800]/20 text-[#ffb95f] border border-[#ee9800]/30 mb-3">
            <CheckCircle2 className="w-4 h-4 text-[#ffb95f]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Simples & Rápido
            </span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            Como fazer o seu pedido
          </h2>

          <p className="text-sm sm:text-base text-[#e4beba]/80 mt-2">
            Sem necessidade de cadastro complicado. Peça em poucos passos e receba quentinho onde estiver.
          </p>
        </div>

        {/* 5 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="flex flex-col bg-[#201f1f] border border-[#2a2a2a] p-5 sm:p-6 rounded-2xl shadow-sm relative group hover:bg-[#252424] hover:border-[#353534] transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-black text-lg border ${s.badgeColor}`}
                  >
                    {s.step}
                  </span>
                  <Icon className="w-6 h-6 text-[#ab8985] group-hover:text-white transition-colors" />
                </div>

                <h3 className="font-heading text-base font-bold text-white mb-1.5">
                  {s.title}
                </h3>
                <p className="text-xs text-[#ab8985] leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
