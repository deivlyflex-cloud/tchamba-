import React, { useState, useEffect } from 'react';
import { dbService } from '../lib/dbService';
import { Product, OrderStatus } from '../types';
import { FORMAT_KZ } from '../data/products';
import { X, Plus, Trash2, User, Phone, MapPin, FileText, MessageSquare, AlertCircle } from 'lucide-react';

interface ManualOrderItem {
  productId?: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

interface CreateManualOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: () => void;
}

export const CreateManualOrderModal: React.FC<CreateManualOrderModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [customItemName, setCustomItemName] = useState<string>('');
  const [customItemPrice, setCustomItemPrice] = useState<number>(0);
  const [itemQuantity, setItemQuantity] = useState<number>(1);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<OrderStatus>('Confirmado');
  const [items, setItems] = useState<ManualOrderItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      dbService.getProducts(true).then((prods) => {
        setProducts(prods);
        if (prods.length > 0) {
          setSelectedProductId(prods[0].id);
        }
      });
      // Reset fields
      setCustomerName('');
      setCustomerPhone('');
      setNeighborhood('');
      setDeliveryAddress('');
      setNotes('');
      setStatus('Confirmado');
      setItems([]);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (selectedProductId === 'custom') {
      if (!customItemName.trim() || customItemPrice <= 0) {
        setError('Preencha o nome e preço do item personalizado.');
        return;
      }
      setItems((prev) => [
        ...prev,
        {
          productName: customItemName.trim(),
          unitPrice: customItemPrice,
          quantity: Math.max(1, itemQuantity),
        },
      ]);
      setCustomItemName('');
      setCustomItemPrice(0);
      setItemQuantity(1);
      setError(null);
    } else {
      const prod = products.find((p) => p.id === selectedProductId);
      if (!prod) return;
      setItems((prev) => [
        ...prev,
        {
          productId: prod.id,
          productName: prod.name,
          unitPrice: prod.price,
          quantity: Math.max(1, itemQuantity),
        },
      ]);
      setItemQuantity(1);
      setError(null);
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('Informe o nome do cliente.');
      return;
    }
    if (!customerPhone.trim()) {
      setError('Informe o telefone ou WhatsApp do cliente.');
      return;
    }
    if (!neighborhood.trim()) {
      setError('Informe o bairro ou zona de entrega no Huambo.');
      return;
    }
    if (items.length === 0) {
      setError('Adicione pelo menos 1 produto ao pedido.');
      return;
    }

    setLoading(true);

    const res = await dbService.createOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      neighborhood: neighborhood.trim(),
      deliveryAddress: deliveryAddress.trim() || 'Balcão / A combinar',
      notes: notes.trim(),
      items: items.map((it) => ({
        productId: it.productId,
        productName: it.productName,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
      })),
    });

    if (res.error) {
      setLoading(false);
      setError(`Erro ao salvar pedido: ${res.error}`);
      return;
    }

    // If status is not 'Novo', update it accordingly
    if (res.orderId && status !== 'Novo') {
      await dbService.updateOrderStatus(res.orderId, status);
    }

    setLoading(false);
    onOrderCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#201f1f] border-b border-[#2a2a2a] flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-extrabold text-white">
              Criar Pedido Manual
            </h3>
            <span className="text-xs text-[#ab8985]">
              Registe pedidos presenciais, telefónicos ou de balcão diretamente no sistema
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#2a2a2a] hover:bg-[#353534] flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-5">
          {error && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Dados do Cliente */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-[#ffb95f] uppercase tracking-wider">
              1. Dados do Cliente
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#e4beba] mb-1">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: João Silva"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#e4beba] mb-1">
                  Telefone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="ex: 939 123 456"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#e4beba] mb-1">
                  Bairro / Zona *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Cidade Alta, Benfica, Balcão..."
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#e4beba] mb-1">
                  Endereço / Ponto de Referência
                </label>
                <input
                  type="text"
                  placeholder="ex: Rua do Comércio, mesa 3, etc."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                />
              </div>
            </div>
          </div>

          {/* Produtos do Pedido */}
          <div className="flex flex-col gap-3 pt-4 border-t border-[#2a2a2a]">
            <span className="text-xs font-bold text-[#ffb95f] uppercase tracking-wider">
              2. Itens do Pedido
            </span>

            {/* Selector de Produto */}
            <div className="p-4 rounded-2xl bg-[#131313] border border-[#2a2a2a] flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                <div className="sm:col-span-6">
                  <label className="block text-[11px] font-bold text-[#ab8985] mb-1">
                    Selecionar do Cardápio
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#201f1f] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {FORMAT_KZ(p.price)}
                      </option>
                    ))}
                    <option value="custom">Outro Item Personalizado...</option>
                  </select>
                </div>

                {selectedProductId === 'custom' && (
                  <>
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-[#ab8985] mb-1">
                        Nome do Item
                      </label>
                      <input
                        type="text"
                        placeholder="Nome"
                        value={customItemName}
                        onChange={(e) => setCustomItemName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#201f1f] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-[#ab8985] mb-1">
                        Preço Unit. (Kz)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={customItemPrice || ''}
                        onChange={(e) => setCustomItemPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-[#201f1f] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                      />
                    </div>
                  </>
                )}

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-[#ab8985] mb-1">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl bg-[#201f1f] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full py-2 px-3 rounded-xl bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>

              {/* Items Table */}
              {items.length > 0 ? (
                <div className="mt-2 border-t border-[#2a2a2a] pt-3 flex flex-col gap-2">
                  {items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#201f1f] border border-[#2a2a2a] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#2a2a2a] flex items-center justify-center font-bold text-white text-[11px]">
                          {it.quantity}x
                        </span>
                        <span className="font-semibold text-white">{it.productName}</span>
                        <span className="text-[#ab8985]">({FORMAT_KZ(it.unitPrice)} un.)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-[#ffb95f]">
                          {FORMAT_KZ(it.unitPrice * it.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 rounded-lg text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-2 px-2 text-sm font-extrabold text-white">
                    <span>Total do Pedido:</span>
                    <span className="text-[#ffb95f] text-base">{FORMAT_KZ(total)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-[#ab8985]">
                  Nenhum item adicionado ainda.
                </div>
              )}
            </div>
          </div>

          {/* Estado Inicial & Observações */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#2a2a2a]">
            <div>
              <label className="block text-xs font-bold text-[#e4beba] mb-1">
                Estado Inicial do Pedido
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
              >
                <option value="Novo">Novo</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Em preparação">Em preparação</option>
                <option value="Pronto">Pronto</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#e4beba] mb-1">
                Observações (opcional)
              </label>
              <input
                type="text"
                placeholder="ex: Sem cebola, entrega com troco de 5000..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#2a2a2a] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] text-xs font-bold text-[#ab8985] hover:text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="px-6 py-2.5 rounded-xl bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#d32f2f]/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'A registar...' : 'Salvar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
