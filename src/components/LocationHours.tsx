import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Store,
  Navigation,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const LocationHours: React.FC = () => {
  const [isOpenNow, setIsOpenNow] = useState(true);

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const openMinutes = 10 * 60; // 10:00
      const closeMinutes = 23 * 60 + 30; // 23:30
      setIsOpenNow(currentMinutes >= openMinutes && currentMinutes <= closeMinutes);
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="localizacao" className="w-full px-4 sm:px-6 lg:px-12 py-16 sm:py-20 bg-[#131313] scroll-mt-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 sm:gap-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-[#ffb95f]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#ffb95f]">
                Presença & Atendimento
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              Onde Estamos & Horários
            </h2>
            <p className="text-sm text-[#e4beba]/80 mt-1">
              Venha buscar o seu pedido no local ou solicite entrega expressa para a sua casa ou escritório.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Info Cards Left (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Horário Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#201f1f] border border-[#2a2a2a] shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ee9800]/20 border border-[#ee9800]/30 text-[#ffb95f] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#ffb95f]" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-white">
                      Horário de Funcionamento
                    </h3>
                    <span className="text-xs text-[#ab8985]">Segunda a Domingo</span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    isOpenNow
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                    }`}
                  />
                  <span>{isOpenNow ? 'Aberto Agora' : 'Fechado Agora'}</span>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#2a2a2a] border border-[#353534] flex items-center justify-between">
                <span className="text-sm text-[#e4beba] font-medium">Atendimento Contínuo</span>
                <span className="font-heading text-base font-bold text-[#ffb95f]">
                  10:00 – 23:30
                </span>
              </div>

              <p className="text-xs text-[#ab8985] leading-relaxed">
                Pedidos feitos até às 23:15 garantem entrega no mesmo dia em todo o perímetro urbano de Huambo.
              </p>
            </div>

            {/* Localização Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#201f1f] border border-[#2a2a2a] shadow-md flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d32f2f]/20 border border-[#d32f2f]/30 text-[#ffb3ac] flex items-center justify-center">
                  <Store className="w-5 h-5 text-[#d32f2f]" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-white">
                    Visite a Tchemba
                  </h3>
                  <span className="text-xs text-[#ab8985]">Huambo Centro, Angola</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 bg-[#1a1919] p-3 rounded-xl border border-[#2a2a2a]">
                <span className="text-[10px] text-[#ab8985] uppercase font-bold">
                  Endereço Oficial
                </span>
                <span className="text-sm text-white font-medium">
                  6PHR+VH8, R. Silva Porto, Huambo, Angola
                </span>
              </div>

              <div>
                <a
                  href="https://maps.google.com/?q=6PHR%2BVH8+Huambo+Angola"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2a2a2a] hover:bg-[#353534] text-white text-xs font-bold border border-[#353534] transition-colors"
                >
                  <Navigation className="w-4 h-4 text-[#ffb95f]" />
                  <span>ABRIR NO GOOGLE MAPS</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#ab8985]" />
                </a>
              </div>
            </div>

            {/* Contactos Rápidos Card */}
            <div
              id="contactos"
              className="p-5 sm:p-6 rounded-2xl bg-[#201f1f] border border-[#2a2a2a] shadow-lg flex flex-col gap-4 scroll-mt-24"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                    <span>Contactos & Atendimento</span>
                  </h3>
                  <p className="text-xs text-[#ab8985] mt-0.5">
                    Faça o seu pedido ou tire dúvidas em tempo real
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Disponível
                </span>
              </div>

              {/* Lista equilibrada e elegante de canais de atendimento */}
              <div className="flex flex-col gap-2.5">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/244939779057?text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20um%20pedido%20na%20Tchemba%20Fast-Food!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-[#2a2a2a] hover:bg-[#333232] border border-[#353534] hover:border-[#25D366]/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                      <WhatsAppIcon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#ab8985] uppercase font-bold tracking-wider">
                          WhatsApp
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                          Directo
                        </span>
                      </div>
                      <span className="text-sm font-bold text-white group-hover:text-[#25D366] transition-colors">
                        +244 939 779 057
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#ab8985] group-hover:text-white transition-colors" />
                </a>

                {/* Chamada Telefónica */}
                <a
                  href="tel:+244939779057"
                  className="p-3.5 rounded-xl bg-[#2a2a2a] hover:bg-[#333232] border border-[#353534] hover:border-[#ffb3ac]/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ffb3ac]/15 text-[#ffb3ac] flex items-center justify-center shrink-0 group-hover:bg-[#d32f2f] group-hover:text-white transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#ab8985] uppercase font-bold tracking-wider">
                        Telefone
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-[#ffb3ac] transition-colors">
                        939 779 057
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#ab8985] group-hover:text-white transition-colors" />
                </a>

                {/* E-mail Oficial */}
                <a
                  href="mailto:tchembacrispy@gmail.com"
                  className="p-3.5 rounded-xl bg-[#2a2a2a] hover:bg-[#333232] border border-[#353534] hover:border-[#ffb95f]/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ffb95f]/15 text-[#ffb95f] flex items-center justify-center shrink-0 group-hover:bg-[#ee9800] group-hover:text-[#1c1b1b] transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-[#ab8985] uppercase font-bold tracking-wider">
                        E-mail
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-[#ffb95f] transition-colors truncate">
                        tchembacrispy@gmail.com
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#ab8985] group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Map Visual Right (7 cols) */}
          <div className="lg:col-span-7 flex flex-col min-h-[420px] lg:min-h-[500px]">
            <div
              className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden bg-cover bg-center border border-[#2a2a2a] shadow-lg flex flex-col justify-end p-5 sm:p-6"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDchqLQQ30kA7EddQPreNCocnahEE6aqalbByuulaZhfPIIvdH7Tx6-HMP-AMyYCd6vFem-Jplb50cjIoEPN3dW007h6zlz-1hgpvhcjO70BjJ_9wxjbTDt1kDO96rKctNREFn1a-nexy9FCZmVj8fmHwqMEXcyXHvHeuM658QuxWv0TgnU2QPR9WNKQSXuTUIKcgHm6GtASX-ilLw-vWVpIfCwtzdO4NBYLjvegMdUNA9rccvRu8RFMw')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

              {/* Map Floating Card */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#201f1f]/95 border border-[#353534] backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#d32f2f] text-white flex items-center justify-center shadow-md">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-bold text-white">
                      Restaurante Tchemba
                    </h4>
                    <span className="text-xs text-[#ab8985] block">
                      Rua Silva Porto, Huambo Centro
                    </span>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=6PHR%2BVH8+Huambo+Angola"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#ffb95f] hover:bg-[#ffdeac] text-[#472a00] font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Ver Rota</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
