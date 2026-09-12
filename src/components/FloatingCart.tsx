import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { FORMAT_KZ } from '../data/products';

interface FloatingCartProps {
  items: CartItem[];
  onOpenCart: () => void;
}

export const FloatingCart: React.FC<FloatingCartProps> = ({ items, onOpenCart }) => {
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (count === 0) return null;

  return (
    <div className="fixed bottom-5 left-4 right-4 sm:hidden z-30 flex justify-center pointer-events-none">
      <button
        onClick={onOpenCart}
        className="pointer-events-auto w-full max-w-sm px-4 py-3 rounded-full bg-[#d32f2f] text-white shadow-[0_8px_30px_rgba(211,47,47,0.5)] flex items-center justify-between font-bold border border-red-400/30 active:scale-98 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-white text-[#d32f2f] text-xs font-black flex items-center justify-center">
            {count}
          </span>
          <span className="text-xs uppercase tracking-wider">Ver Carrinho</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-black">{FORMAT_KZ(total)}</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
};
