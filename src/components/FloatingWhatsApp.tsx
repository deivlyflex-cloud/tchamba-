import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-30">
      <a
        href="https://wa.me/244939779057?text=Ol%C3%A1%2C%20gostaria%20de%20obter%20mais%20informa%C3%A7%C3%B5es%20sobre%20a%20Tchemba%20Fast-Food."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] transition-all hover:scale-110 active:scale-95 cursor-pointer"
      >
        <WhatsAppIcon className="w-8 h-8 text-white" />

        {/* Pulse beacon */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-sm">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
        </span>

        {/* Tooltip on hover */}
        <div className="hidden sm:block absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[#1c1b1b] border border-[#25D366]/40 text-xs font-bold text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-xl">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#25D366]" />
            <span>Falar no WhatsApp</span>
          </div>
        </div>
      </a>
    </div>
  );
};
