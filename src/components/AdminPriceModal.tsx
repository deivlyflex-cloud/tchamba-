import React, { useState } from 'react';
import { Product } from '../types';
import { FORMAT_KZ, getProductImage } from '../data/products';
import { X, Sliders, Check, RotateCcw } from 'lucide-react';

interface AdminPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProduct: (productId: string, newPrice: number, isConsultation: boolean) => void;
  onResetDefaults: () => void;
}

export const AdminPriceModal: React.FC<AdminPriceModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProduct,
  onResetDefaults,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-[#201f1f] border-b border-[#2a2a2a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[#ffb95f]" />
            <div>
              <h3 className="font-heading text-lg font-bold text-white">
                Painel de Ajustes de Preços
              </h3>
              <span className="text-xs text-[#ab8985]">
                Edite preços ou alterne produtos para &ldquo;Sob Consulta&rdquo;
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#2a2a2a] hover:bg-[#353534] flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Products list */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {products.map((product) => {
            return (
              <div
                key={product.id}
                className="p-3.5 rounded-xl bg-[#201f1f] border border-[#2a2a2a] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    alt={product.name}
                    src={getProductImage(product, product.image)}
                    className="w-10 h-10 rounded-lg object-cover border border-[#2a2a2a]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{product.name}</h4>
                    <span className="text-[11px] text-[#ab8985]">
                      {product.isConsultation && product.price === 0
                        ? 'Sob Consulta'
                        : FORMAT_KZ(product.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="50"
                    min="0"
                    placeholder="Kz"
                    defaultValue={product.price || ''}
                    onBlur={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 0) {
                        onUpdateProduct(product.id, val, false);
                      }
                    }}
                    className="w-24 px-2 py-1 text-xs bg-[#131313] border border-[#2a2a2a] rounded-lg text-white text-right focus:border-[#ffb95f] focus:outline-none"
                  />

                  <button
                    onClick={() => {
                      const nextConsult = !product.isConsultation;
                      onUpdateProduct(product.id, nextConsult ? 0 : 4500, nextConsult);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      product.isConsultation && product.price === 0
                        ? 'bg-[#ffb95f]/20 border-[#ffb95f] text-[#ffb95f]'
                        : 'bg-[#2a2a2a] border-[#353534] text-[#ab8985]'
                    }`}
                  >
                    {product.isConsultation && product.price === 0 ? 'Consulta' : 'Fixo'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#201f1f] border-t border-[#2a2a2a] flex items-center justify-between">
          <button
            onClick={onResetDefaults}
            className="inline-flex items-center gap-1.5 text-xs text-[#ab8985] hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrões</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs cursor-pointer"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
