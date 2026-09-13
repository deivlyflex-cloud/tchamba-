import React from 'react';
import { CartItem } from '../types';
import { FORMAT_KZ, DEFAULT_PRODUCT_IMAGE } from '../data/products';
import { ShoppingBag, X, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
}) => {
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-over Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 w-full max-w-md h-full bg-[#1c1b1b] border-l border-[#2a2a2a] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 bg-[#201f1f] border-b border-[#2a2a2a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-[#ffb95f]" />
            <h3 className="font-heading text-lg font-bold text-white">O Seu Pedido</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ffb95f] text-[#472a00] text-xs font-black">
              {totalCount}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar Carrinho"
            className="w-9 h-9 rounded-full bg-[#2a2a2a] hover:bg-[#353534] flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Items Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-72 text-center text-[#ab8985]">
              <div className="w-16 h-16 rounded-full bg-[#201f1f] border border-[#2a2a2a] flex items-center justify-center mb-3 text-[#353534]">
                <ShoppingBag className="w-8 h-8 text-[#ab8985]" />
              </div>
              <p className="font-heading text-base font-bold text-white">
                O seu carrinho está vazio
              </p>
              <p className="text-xs text-[#ab8985] mt-1 max-w-xs">
                Adicione combos e Cheese Drums deliciosos do nosso cardápio para pedir!
              </p>
            </div>
          ) : (
            items.map((item) => {
              const itemTotal = item.product.price * item.quantity;
              return (
                <div
                  key={item.product.id}
                  className="p-4 rounded-2xl bg-[#201f1f] border border-[#2a2a2a] flex flex-col gap-2.5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        alt={item.product.name}
                        src={item.product.image?.trim() || DEFAULT_PRODUCT_IMAGE}
                        className="w-12 h-12 rounded-xl object-cover border border-[#2a2a2a]"
                      />
                      <div>
                        <h4 className="font-heading text-sm font-bold text-white">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-[#ab8985] line-clamp-1">
                          {item.product.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-[#ab8985] hover:text-[#ffb4ab] transition-colors p-1 cursor-pointer"
                      title="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#2a2a2a]/60">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-[#131313] rounded-xl p-1 border border-[#2a2a2a]">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-7 h-7 rounded-lg bg-[#201f1f] flex items-center justify-center text-white hover:bg-[#ffb95f] hover:text-[#472a00] transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-white px-2">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-7 h-7 rounded-lg bg-[#201f1f] flex items-center justify-center text-white hover:bg-[#ffb95f] hover:text-[#472a00] transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-heading text-sm font-extrabold text-[#ffb95f]">
                      {FORMAT_KZ(itemTotal)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-5 bg-[#201f1f] border-t border-[#2a2a2a] flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-[#ab8985]">
              <span>Subtotal</span>
              <span className="text-white font-bold">{FORMAT_KZ(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#ab8985]">
              <span>Taxa de Entrega</span>
              <span className="text-[#ffb95f] font-semibold">
                A combinar pelo WhatsApp
              </span>
            </div>

            <div className="flex items-center justify-between font-heading text-base text-white pt-2 border-t border-[#2a2a2a]">
              <span className="font-bold">Total do Pedido</span>
              <span className="font-black text-[#ffb95f] text-lg">
                {FORMAT_KZ(subtotal)}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenCheckout}
            disabled={items.length === 0}
            className="w-full py-3.5 rounded-full bg-[#d32f2f] hover:bg-[#b71c1c] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm tracking-wider shadow-lg shadow-[#d32f2f]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>FINALIZAR PEDIDO</span>
          </button>
        </div>
      </div>
    </>
  );
};
