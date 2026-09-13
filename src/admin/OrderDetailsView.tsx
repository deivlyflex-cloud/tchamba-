import React, { useState, useEffect } from 'react';
import { dbService } from '../lib/dbService';
import { OrderRecord, OrderStatus } from '../types';
import { FORMAT_KZ, getProductImage } from '../data/products';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  FileText,
  Printer,
  MessageSquare,
  AlertCircle,
  Check,
  X,
  User,
  ShoppingBag,
  ExternalLink,
  Copy,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface OrderDetailsViewProps {
  order?: OrderRecord | null;
  orderIdOrNumber?: string;
  onBack: () => void;
  onOrderUpdated?: (updatedOrder: OrderRecord) => void;
}

export const OrderDetailsView: React.FC<OrderDetailsViewProps> = ({
  order: initialOrder,
  orderIdOrNumber,
  onBack,
  onOrderUpdated,
}) => {
  const [order, setOrder] = useState<OrderRecord | null>(initialOrder || null);
  const [loading, setLoading] = useState(!initialOrder && Boolean(orderIdOrNumber));
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Load order if only ID / order_number was provided or on refresh
  const loadOrder = async () => {
    const target = order?.id || order?.order_number || orderIdOrNumber;
    if (!target) return;
    setLoading(true);
    const data = await dbService.getOrderById(target);
    if (data) {
      setOrder(data);
      if (onOrderUpdated) onOrderUpdated(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialOrder) {
      setOrder(initialOrder);
    } else if (orderIdOrNumber) {
      loadOrder();
    }
  }, [initialOrder, orderIdOrNumber]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackToast({ text, type });
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const copyOrderNumber = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.order_number);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    setUpdatingStatus(true);
    const { error } = await dbService.updateOrderStatus(order.id, newStatus);
    setUpdatingStatus(false);

    if (!error) {
      const updated = { ...order, status: newStatus };
      setOrder(updated);
      if (onOrderUpdated) onOrderUpdated(updated);
      showToast(`Estado atualizado para: ${newStatus === 'Novo' ? 'Aguardando Aprovação (Pendente)' : newStatus}`);
    } else {
      showToast(`Erro ao atualizar estado: ${error}`, 'error');
    }
  };

  // Botão Aprovação Manual
  const handleApprove = async () => {
    await handleStatusChange('Confirmado');
    showToast('Pedido aprovado e confirmado com sucesso!', 'success');
  };

  // Botão Cancelar Pedido
  const handleConfirmCancel = async () => {
    setCancelModalOpen(false);
    await handleStatusChange('Cancelado');
    showToast('Pedido cancelado.', 'success');
  };

  // Status mapping
  const statusMeta: Record<OrderStatus, { label: string; badgeClass: string; stepIndex: number; desc: string }> = {
    Novo: {
      label: 'Aguardando Aprovação (Pendente)',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse',
      stepIndex: 0,
      desc: 'Pedido submetido pelo cliente. Requer aprovação manual do restaurante.',
    },
    Confirmado: {
      label: 'Confirmado (Aprovado)',
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      stepIndex: 1,
      desc: 'Pedido aprovado pelo operador. Pronto para ser encaminhado à cozinha.',
    },
    'Em preparação': {
      label: 'Em Preparação',
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      stepIndex: 2,
      desc: 'A cozinha está preparando os itens estaladiços com queijo derretido.',
    },
    Pronto: {
      label: 'Pronto para Entrega / Levantamento',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      stepIndex: 3,
      desc: 'Itens prontos e embalados quentinhos aguardando o estafeta ou cliente.',
    },
    Concluído: {
      label: 'Concluído & Entregue',
      badgeClass: 'bg-emerald-900/40 text-emerald-200 border-emerald-700/50',
      stepIndex: 4,
      desc: 'Pedido entregue com sucesso e pagamento recebido.',
    },
    Cancelado: {
      label: 'Cancelado',
      badgeClass: 'bg-red-500/20 text-red-300 border-red-500/40',
      stepIndex: -1,
      desc: 'Este pedido foi cancelado.',
    },
  };

  const stepsList: { status: OrderStatus; title: string }[] = [
    { status: 'Novo', title: '1. Aguardando Aprovação' },
    { status: 'Confirmado', title: '2. Confirmado' },
    { status: 'Em preparação', title: '3. Em Preparação' },
    { status: 'Pronto', title: '4. Pronto' },
    { status: 'Concluído', title: '5. Concluído' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-center">
        <RefreshCw className="w-8 h-8 text-[#ffb95f] animate-spin" />
        <span className="text-sm text-[#ab8985]">A carregar detalhes do pedido...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl p-8 text-center flex flex-col items-center gap-4 max-w-lg mx-auto mt-6">
        <AlertTriangle className="w-10 h-10 text-amber-400" />
        <h3 className="text-lg font-bold text-white">Pedido Não Encontrado</h3>
        <p className="text-xs text-[#ab8985]">
          Não foi possível encontrar as informações deste pedido na base de dados.
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-[#2a2a2a] hover:bg-[#353534] text-white text-xs font-bold transition-all cursor-pointer"
        >
          Voltar à Lista de Pedidos
        </button>
      </div>
    );
  }

  const currentMeta = statusMeta[order.status] || statusMeta.Novo;
  const isPendingApproval = order.status === 'Novo';

  // Format date
  const orderDate = order.created_at ? new Date(order.created_at) : new Date();
  const dateFormatted = orderDate.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeFormatted = orderDate.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate items
  const items = order.items || [];
  const calculatedSubtotal =
    items.length > 0
      ? items.reduce((sum, item) => sum + (Number(item.unit_price) * Number(item.quantity)), 0)
      : Number(order.subtotal || order.total || 0);

  // WhatsApp click handler
  const openWhatsAppWithCustomer = () => {
    let cleanPhone = order.customer_phone.replace(/\D/g, '');
    if (!cleanPhone.startsWith('244') && cleanPhone.length === 9) {
      cleanPhone = `244${cleanPhone}`;
    }
    const message = encodeURIComponent(
      `Olá ${order.customer_name}! Somos do Tchemba Fast Food.\n\n` +
      `Referente ao seu Pedido *${order.order_number}*:\n` +
      `Estado atual: *${currentMeta.label}*\n` +
      `Total: *${FORMAT_KZ(order.total)}*\n\n` +
      `Como podemos ajudar?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      {/* Toast Notification */}
      {feedbackToast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border transition-all animate-fade-in ${
            feedbackToast.type === 'success'
              ? 'bg-[#1b2b1e] text-emerald-300 border-emerald-500/40'
              : 'bg-[#301616] text-red-300 border-red-500/40'
          }`}
        >
          {feedbackToast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="text-xs font-semibold">{feedbackToast.text}</span>
        </div>
      )}

      {/* Top Breadcrumb / Nav */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1c1b1b] hover:bg-[#2a2a2a] text-xs font-bold text-[#ab8985] hover:text-white border border-[#2a2a2a] transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Voltar para Lista de Pedidos</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={loadOrder}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1c1b1b] hover:bg-[#2a2a2a] text-xs font-medium text-[#ab8985] hover:text-white border border-[#2a2a2a] transition-colors cursor-pointer"
            title="Atualizar dados"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>

          <button
            onClick={openWhatsAppWithCustomer}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs font-bold transition-colors cursor-pointer shadow"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Falar no WhatsApp</span>
          </button>

          <button
            onClick={handlePrintReceipt}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2a2a2a] hover:bg-[#353534] text-xs font-bold text-white transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Imprimir Comanda</span>
          </button>
        </div>
      </div>

      {/* Main Order Header Card */}
      <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#d32f2f]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2a2a2a] pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ab8985]">
                Pedido de Venda
              </span>
              <span className="text-xs text-[#555]">•</span>
              <span className="text-xs text-[#ab8985]">
                {dateFormatted} às {timeFormatted}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="font-mono text-2xl sm:text-3xl font-black text-[#ffb95f] tracking-tight">
                {order.order_number}
              </h1>
              <button
                onClick={copyOrderNumber}
                className="p-1.5 rounded-lg bg-[#2a2a2a] hover:bg-[#333] text-[#ab8985] hover:text-white transition-colors cursor-pointer"
                title="Copiar número do pedido"
              >
                {copiedNumber ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex flex-col sm:items-end gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ab8985]">
              Estado Atual
            </span>
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border ${currentMeta.badgeClass}`}
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              <span>{currentMeta.label}</span>
            </span>
          </div>
        </div>

        {/* BANNER EM DESTAQUE: AGUARDANDO APROVAÇÃO MANUAL */}
        {isPendingApproval && (
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex flex-col gap-4 shadow-lg animate-fade-in">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <span>Pedido Novo - Aguarda Aprovação Manual</span>
                </h3>
                <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                  Este pedido acabou de ser submetido e está <strong>Pendente</strong>. O operador deve aprovar manualmente para confirmar com o cliente e iniciar a preparação na cozinha.
                </p>
              </div>
            </div>

            {/* Ações de Aprovação Manual */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-amber-500/20">
              <button
                disabled={updatingStatus}
                onClick={handleApprove}
                className="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-900/40 transition-all cursor-pointer uppercase tracking-wider disabled:opacity-50"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Aprovar Pedido Agora</span>
              </button>

              <button
                disabled={updatingStatus}
                onClick={() => setCancelModalOpen(true)}
                className="py-3 px-5 rounded-xl bg-red-600/20 hover:bg-red-600/30 active:scale-95 text-red-300 border border-red-500/40 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer uppercase tracking-wider disabled:opacity-50"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
                <span>Recusar / Cancelar</span>
              </button>
            </div>
          </div>
        )}

        {/* WORKFLOW STEPPER (Progresso do Pedido) */}
        {order.status !== 'Cancelado' && (
          <div className="flex flex-col gap-3 py-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ab8985]">
              Fluxo de Produção & Entrega
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {stepsList.map((step, idx) => {
                const isActive = step.status === order.status;
                const isPassed = currentMeta.stepIndex > idx;

                return (
                  <button
                    key={step.status}
                    disabled={updatingStatus}
                    onClick={() => handleStatusChange(step.status)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${
                      isActive
                        ? 'bg-[#d32f2f]/20 border-[#d32f2f] text-white shadow-md'
                        : isPassed
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 hover:border-emerald-500/50'
                        : 'bg-[#131313] border-[#2a2a2a] text-[#ab8985] hover:border-[#3a3a3a] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                        Passo {idx + 1}
                      </span>
                      {isPassed ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                      ) : isActive ? (
                        <span className="w-2 h-2 rounded-full bg-[#ffb95f] animate-pulse" />
                      ) : null}
                    </div>
                    <span className="text-xs font-bold truncate mt-1">
                      {step.status === 'Novo' ? 'Aprovação' : step.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SE O PEDIDO ESTIVER CANCELADO */}
        {order.status === 'Cancelado' && (
          <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <div>
                <span className="text-xs font-bold text-red-300 block">Este pedido foi cancelado</span>
                <span className="text-[11px] text-red-300/70">
                  Deseja restaurar ou reabrir este pedido?
                </span>
              </div>
            </div>
            <button
              onClick={() => handleStatusChange('Novo')}
              className="px-3.5 py-1.5 rounded-xl bg-[#2a2a2a] hover:bg-[#353534] text-xs font-bold text-white transition-all cursor-pointer"
            >
              Reabrir como Pendente
            </button>
          </div>
        )}
      </div>

      {/* Grid: Client & Delivery Info (Left), Items & Totals (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Client & Address (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Customer Card */}
          <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl p-6 flex flex-col gap-4 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffb95f] flex items-center gap-2 border-b border-[#2a2a2a] pb-3">
              <User className="w-4 h-4 text-[#ffb95f]" />
              <span>Dados do Cliente</span>
            </h3>

            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[10px] text-[#ab8985] uppercase font-bold tracking-wider block">
                  Nome Completo
                </span>
                <span className="text-sm font-bold text-white block mt-0.5">
                  {order.customer_name}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[#ab8985] uppercase font-bold tracking-wider block">
                  Telefone / WhatsApp
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-mono font-bold text-white">
                    {order.customer_phone}
                  </span>
                  <a
                    href={`tel:${order.customer_phone.replace(/\s+/g, '')}`}
                    className="p-1.5 rounded-lg bg-[#2a2a2a] hover:bg-[#353534] text-white transition-colors"
                    title="Ligar para o cliente"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={openWhatsAppWithCustomer}
                    className="p-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] transition-colors cursor-pointer"
                    title="Conversar no WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl p-6 flex flex-col gap-4 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffb95f] flex items-center gap-2 border-b border-[#2a2a2a] pb-3">
              <MapPin className="w-4 h-4 text-[#ffb95f]" />
              <span>Localização & Entrega</span>
            </h3>

            <div className="flex flex-col gap-3.5">
              <div>
                <span className="text-[10px] text-[#ab8985] uppercase font-bold tracking-wider block">
                  Bairro / Zona (Huambo)
                </span>
                <span className="text-sm font-semibold text-white block mt-0.5">
                  {order.neighborhood || 'Não especificado'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[#ab8985] uppercase font-bold tracking-wider block">
                  Endereço / Ponto de Referência
                </span>
                <p className="text-xs text-[#e5e2e1] leading-relaxed mt-0.5 bg-[#131313] p-3 rounded-xl border border-[#2a2a2a]">
                  {order.delivery_address || 'A combinar'}
                </p>
              </div>

              {order.notes && (
                <div>
                  <span className="text-[10px] text-[#ab8985] uppercase font-bold tracking-wider block">
                    Observações do Pedido
                  </span>
                  <p className="text-xs text-[#ffb95f]/90 leading-relaxed mt-0.5 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 italic">
                    "{order.notes}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Items & Financials (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl p-6 sm:p-7 flex flex-col gap-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffb95f] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#ffb95f]" />
                <span>Itens do Pedido ({items.length})</span>
              </h3>
              <span className="text-xs text-[#ab8985]">
                Huambo Fast Food
              </span>
            </div>

            {/* Items List */}
            <div className="flex flex-col divide-y divide-[#2a2a2a]">
              {items.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#ab8985]">
                  Nenhum item detalhado registado para este pedido.
                </div>
              ) : (
                items.map((item, index) => {
                  const itemImg = getProductImage({ name: item.product_name });
                  const subtotal = Number(item.subtotal) || Number(item.unit_price) * Number(item.quantity);

                  return (
                    <div key={item.id || index} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={itemImg}
                          alt={item.product_name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#2a2a2a] shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                            {item.product_name}
                          </h4>
                          <span className="text-[11px] text-[#ab8985] block">
                            {FORMAT_KZ(item.unit_price)} × {item.quantity} uni.
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs sm:text-sm font-mono font-bold text-white block">
                          {FORMAT_KZ(subtotal)}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-medium">
                          Qtd: {item.quantity}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Financial Totals Box */}
            <div className="mt-4 pt-4 border-t-2 border-[#2a2a2a] flex flex-col gap-2.5">
              <div className="flex justify-between text-xs text-[#ab8985]">
                <span>Subtotal dos Produtos:</span>
                <span className="text-white font-mono font-semibold">
                  {FORMAT_KZ(calculatedSubtotal)}
                </span>
              </div>

              <div className="flex justify-between text-xs text-[#ab8985]">
                <span>Taxa de Entrega:</span>
                <span className="text-emerald-400 font-semibold">
                  A combinar / Bairro {order.neighborhood || ''}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#2a2a2a] text-base sm:text-lg font-black text-white">
                <span className="text-sm font-bold uppercase tracking-wider text-[#ab8985]">
                  Total a Pagar:
                </span>
                <span className="font-heading font-black text-xl sm:text-2xl text-[#ffb95f]">
                  {FORMAT_KZ(order.total || calculatedSubtotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal to Cancel */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#1c1b1b] border border-red-500/40 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-heading text-lg font-bold text-white">
                Cancelar Pedido {order.order_number}?
              </h3>
            </div>

            <p className="text-xs text-[#ab8985] leading-relaxed">
              Tem certeza de que deseja cancelar este pedido do cliente <strong>{order.customer_name}</strong>?
              O estado será alterado para Cancelado.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#2a2a2a] hover:bg-[#353534] text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-colors cursor-pointer shadow"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
