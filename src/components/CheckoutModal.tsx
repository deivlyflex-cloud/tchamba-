import React, { useState } from 'react';
import { CartItem, CustomerOrderInfo } from '../types';
import { FORMAT_KZ, getProductImage } from '../data/products';
import { dbService } from '../lib/dbService';
import {
  X,
  Send,
  User,
  Phone,
  MapPin,
  FileText,
  MessageSquare,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCompleted: () => void;
}

interface CompletedOrderData {
  orderNumber: string;
  total: number;
  items: CartItem[];
  customerInfo: CustomerOrderInfo;
  whatsappUrl: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderCompleted,
}) => {
  const [formData, setFormData] = useState<CustomerOrderInfo>({
    name: '',
    phone: '',
    zone: '',
    address: '',
    notes: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrderData | null>(null);
  const [copiedNumber, setCopiedNumber] = useState(false);

  if (!isOpen) return null;

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCopyOrderNumber = () => {
    if (!completedOrder) return;
    navigator.clipboard.writeText(completedOrder.orderNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleFinishAndClose = () => {
    setCompletedOrder(null);
    onOrderCompleted();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Por favor, insira o seu nome.';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Insira o seu número de WhatsApp / telefone.';
    }
    if (!formData.zone.trim()) {
      newErrors.zone = 'Indique o seu bairro ou zona no Huambo.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    // 1. Save order in Supabase BEFORE opening WhatsApp
    const orderItemsPayload = items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      unitPrice: item.product.price,
      quantity: item.quantity,
    }));

    const result = await dbService.createOrder({
      customerName: formData.name.trim(),
      customerPhone: formData.phone.trim(),
      neighborhood: formData.zone.trim(),
      deliveryAddress: formData.address.trim() || 'A combinar',
      notes: formData.notes?.trim() || '',
      items: orderItemsPayload,
    });

    const orderNumber = result.orderNumber;

    // 2. Build the exact specified WhatsApp message without emojis
    const itemsList = items
      .map(
        (item) =>
          `${item.quantity}x ${item.product.name} - ${FORMAT_KZ(
            item.product.price * item.quantity
          )}`
      )
      .join('\n');

    const message = `Olá, Tchemba.

Gostaria de fazer o seguinte pedido:

PEDIDO ${orderNumber}

${itemsList}

TOTAL: ${FORMAT_KZ(total)}

DADOS DO CLIENTE

Nome: ${formData.name.trim()}
Telefone: ${formData.phone.trim()}
Localização: ${formData.zone.trim()} - ${formData.address.trim() || 'Huambo'}
Observações: ${formData.notes?.trim() || 'Nenhuma'}

Aguardo a confirmação do pedido.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/244939779057?text=${encodedMessage}`;

    setSubmitting(false);

    // Save order data for details view
    setCompletedOrder({
      orderNumber,
      total,
      items: [...items],
      customerInfo: { ...formData },
      whatsappUrl,
    });

    // Attempt to open WhatsApp
    try {
      window.open(whatsappUrl, '_blank');
    } catch {
      // Handled gracefully in UI
    }
  };

  if (completedOrder) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-lg bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-5 sm:p-6 bg-[#201f1f] border-b border-[#2a2a2a] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  Detalhes do Pedido
                </h3>
                <span className="text-xs text-[#ab8985]">
                  Tchemba Fast Food • Huambo
                </span>
              </div>
            </div>

            <button
              onClick={handleFinishAndClose}
              className="w-9 h-9 rounded-full bg-[#2a2a2a] hover:bg-[#353534] flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-4">
            {/* Status Banner */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex flex-col gap-2 shadow">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-black tracking-wider text-[#ab8985]">
                  Estado do Pedido
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Aguardando Aprovação (Pendente)</span>
                </span>
              </div>

              <p className="text-xs text-amber-200/90 leading-relaxed mt-1">
                O seu pedido foi recebido pelo sistema e está <strong>pendente aguardando a aprovação manual</strong> do restaurante. O operador irá confirmar e iniciar o preparo imediatamente.
              </p>
            </div>

            {/* Order Number Box */}
            <div className="p-4 rounded-2xl bg-[#131313] border border-[#2a2a2a] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#ab8985] tracking-wider block">
                  Número do Pedido
                </span>
                <span className="font-mono text-xl font-black text-[#ffb95f]">
                  {completedOrder.orderNumber}
                </span>
              </div>
              <button
                onClick={handleCopyOrderNumber}
                className="px-3 py-1.5 rounded-xl bg-[#2a2a2a] hover:bg-[#333] text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedNumber ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#ab8985]" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            {/* Primary Action: Abrir WhatsApp */}
            <a
              href={completedOrder.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-[#25D366]/20 transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Abrir WhatsApp com o Restaurante</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Items List */}
            <div className="p-4 rounded-2xl bg-[#131313] border border-[#2a2a2a] flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ffb95f]">
                Itens Pedidos ({completedOrder.items.length})
              </span>
              <div className="flex flex-col divide-y divide-[#2a2a2a]">
                {completedOrder.items.map((item) => (
                  <div key={item.product.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={getProductImage(item.product)}
                        alt={item.product.name}
                        className="w-9 h-9 rounded-lg object-cover border border-[#2a2a2a] shrink-0"
                      />
                      <div className="truncate">
                        <span className="font-bold text-white block truncate">
                          {item.quantity}x {item.product.name}
                        </span>
                        <span className="text-[10px] text-[#ab8985]">
                          {FORMAT_KZ(item.product.price)} un.
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white shrink-0 ml-2">
                      {FORMAT_KZ(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#2a2a2a] flex justify-between items-center text-sm font-bold text-white">
                <span>Total a Pagar:</span>
                <span className="text-lg font-black text-[#ffb95f]">
                  {FORMAT_KZ(completedOrder.total)}
                </span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="p-4 rounded-2xl bg-[#131313] border border-[#2a2a2a] flex flex-col gap-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ab8985]">
                Entrega para {completedOrder.customerInfo.name}
              </span>
              <span className="text-[#e5e2e1]">
                {completedOrder.customerInfo.zone} • {completedOrder.customerInfo.address || 'A combinar'}
              </span>
              <span className="text-[#ab8985]">
                Telefone: {completedOrder.customerInfo.phone}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#201f1f] border-t border-[#2a2a2a] flex justify-end">
            <button
              onClick={handleFinishAndClose}
              className="w-full py-3 rounded-xl bg-[#2a2a2a] hover:bg-[#353534] text-xs font-bold text-white uppercase tracking-wider transition-colors cursor-pointer"
            >
              Concluir & Fazer Novo Pedido
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#201f1f] border-b border-[#2a2a2a] flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="font-heading text-lg sm:text-xl font-extrabold text-white">
              Finalizar Pedido
            </h3>
            <span className="text-xs text-[#ab8985]">
              Envio direto para a cozinha e confirmação instantânea no WhatsApp
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#2a2a2a] hover:bg-[#353534] flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-4">
          {/* Order Brief Summary */}
          <div className="p-4 rounded-2xl bg-[#131313] border border-[#2a2a2a] flex flex-col gap-2">
            <span className="text-xs font-bold text-[#ffb95f] uppercase tracking-wider">
              Resumo do Pedido ({items.length} itens)
            </span>
            <div className="text-xs text-[#e4beba]/90 flex flex-col gap-1 max-h-24 overflow-y-auto">
              {items.map((i) => (
                <div key={i.product.id} className="flex justify-between">
                  <span>
                    {i.quantity}x {i.product.name}
                  </span>
                  <span className="font-semibold text-white">
                    {FORMAT_KZ(i.product.price * i.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#2a2a2a] text-sm font-bold text-white">
              <span>Total:</span>
              <span className="text-[#ffb95f] font-extrabold">{FORMAT_KZ(total)}</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#e4beba] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#ffb95f]" />
              <span>O seu Nome Completo *</span>
            </label>
            <input
              type="text"
              placeholder="ex: Manuel dos Santos"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl bg-[#201f1f] border text-white text-sm focus:outline-none transition-colors ${
                errors.name ? 'border-red-500' : 'border-[#2a2a2a] focus:border-[#ffb95f]'
              }`}
            />
            {errors.name && <span className="text-[11px] text-red-400">{errors.name}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#e4beba] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#ffb95f]" />
              <span>Telefone / WhatsApp *</span>
            </label>
            <input
              type="tel"
              placeholder="ex: 939 123 456"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl bg-[#201f1f] border text-white text-sm focus:outline-none transition-colors ${
                errors.phone ? 'border-red-500' : 'border-[#2a2a2a] focus:border-[#ffb95f]'
              }`}
            />
            {errors.phone && <span className="text-[11px] text-red-400">{errors.phone}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#e4beba] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#ffb95f]" />
              <span>Bairro / Zona no Huambo *</span>
            </label>
            <input
              type="text"
              placeholder="ex: Bairro Benfica, Cidade Alta, São João, Canata..."
              value={formData.zone}
              onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl bg-[#201f1f] border text-white text-sm focus:outline-none transition-colors ${
                errors.zone ? 'border-red-500' : 'border-[#2a2a2a] focus:border-[#ffb95f]'
              }`}
            />
            {errors.zone && <span className="text-[11px] text-red-400">{errors.zone}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#e4beba] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#ffb95f]" />
              <span>Endereço Detalhado / Ponto de Referência</span>
            </label>
            <input
              type="text"
              placeholder="ex: Rua do Comércio, próximo ao Colégio..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#201f1f] border border-[#2a2a2a] text-white text-sm focus:outline-none focus:border-[#ffb95f]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#e4beba] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#ffb95f]" />
              <span>Observações (opcional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="ex: Refrigerante bem gelado, sem picante, talheres descartáveis..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#201f1f] border border-[#2a2a2a] text-white text-sm focus:outline-none focus:border-[#ffb95f] resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-extrabold text-sm tracking-wider shadow-lg shadow-[#d32f2f]/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              <span>{submitting ? 'A registar pedido...' : 'ENVIAR PEDIDO PELO WHATSAPP'}</span>
            </button>
            <p className="text-[11px] text-center text-[#ab8985] mt-2">
              O pedido é guardado com segurança no sistema antes da abertura do WhatsApp.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
