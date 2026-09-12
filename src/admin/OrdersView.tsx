import React, { useState, useEffect } from 'react';
import { dbService } from '../lib/dbService';
import { OrderRecord, OrderStatus } from '../types';
import { FORMAT_KZ } from '../data/products';
import { Search, Filter, Phone, MapPin, Calendar, Clock, Check, X, AlertTriangle, MessageCircle, RefreshCw, Plus } from 'lucide-react';
import { CreateManualOrderModal } from './CreateManualOrderModal';

interface OrdersViewProps {
  selectedOrder?: OrderRecord | null;
  onClearSelectedOrder?: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ selectedOrder: initialSelected, onClearSelectedOrder }) => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(initialSelected || null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [createManualModalOpen, setCreateManualModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await dbService.getOrders(statusFilter);
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  useEffect(() => {
    if (initialSelected) {
      setActiveOrder(initialSelected);
    }
  }, [initialSelected]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    if (newStatus === 'Cancelado') {
      setCancelModalOpen(true);
      return;
    }

    setUpdatingStatus(true);
    const { error } = await dbService.updateOrderStatus(orderId, newStatus);
    setUpdatingStatus(false);

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (activeOrder && activeOrder.id === orderId) {
        setActiveOrder({ ...activeOrder, status: newStatus });
      }
    }
  };

  const handleConfirmCancel = async () => {
    if (!activeOrder) return;
    setUpdatingStatus(true);
    const { error } = await dbService.updateOrderStatus(activeOrder.id, 'Cancelado');
    setUpdatingStatus(false);
    setCancelModalOpen(false);

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === activeOrder.id ? { ...o, status: 'Cancelado' } : o))
      );
      setActiveOrder({ ...activeOrder, status: 'Cancelado' });
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_phone.includes(q) ||
      o.neighborhood.toLowerCase().includes(q)
    );
  });

  const statusOptions: OrderStatus[] = [
    'Novo',
    'Confirmado',
    'Em preparação',
    'Pronto',
    'Concluído',
    'Cancelado',
  ];

  const statusColors: Record<OrderStatus, string> = {
    Novo: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Confirmado: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'Em preparação': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Pronto: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Concluído: 'bg-emerald-900/30 text-emerald-300 border-emerald-800/40',
    Cancelado: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-white">
            Gestão de Pedidos
          </h2>
          <span className="text-xs text-[#ab8985]">
            Controlo operacional de todos os pedidos realizados no Huambo
          </span>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setCreateManualModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d32f2f] hover:bg-[#b71c1c] text-xs font-bold text-white shadow-lg shadow-[#d32f2f]/20 transition-all cursor-pointer uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Novo Pedido Manual</span>
          </button>

          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] text-xs font-bold text-[#ab8985] hover:text-white border border-[#2a2a2a] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Horizontal Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {['Todos', 'Novo', 'Confirmado', 'Em preparação', 'Pronto', 'Concluído', 'Cancelado'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                statusFilter === tab
                  ? 'bg-[#d32f2f] text-white border-[#d32f2f]'
                  : 'bg-[#1c1b1b] text-[#ab8985] hover:text-white border-[#2a2a2a]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ab8985]" />
          <input
            type="text"
            placeholder="Pesquisar pedido, cliente, tel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] text-xs text-white placeholder:text-[#ab8985] focus:outline-none focus:border-[#ffb95f]"
          />
        </div>
      </div>

      {/* Main Grid: Orders Table on Left, Details on Right (or Stacked on Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table / List View */}
        <div className={`${activeOrder ? 'lg:col-span-7' : 'lg:col-span-12'} bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl overflow-hidden`}>
          {loading ? (
            <div className="p-8 text-center text-xs text-[#ab8985]">
              Carregando pedidos...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#ab8985]">
              Nenhum pedido encontrado com este filtro.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white">
                <thead className="bg-[#131313] text-[#ab8985] uppercase tracking-wider font-bold text-[10px] border-b border-[#2a2a2a]">
                  <tr>
                    <th className="px-4 py-3.5">Número</th>
                    <th className="px-4 py-3.5">Cliente</th>
                    <th className="px-4 py-3.5">Total</th>
                    <th className="px-4 py-3.5">Estado</th>
                    <th className="px-4 py-3.5">Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]/60">
                  {filteredOrders.map((order) => {
                    const isSelected = activeOrder?.id === order.id;
                    const dateFormatted = order.created_at
                      ? new Date(order.created_at).toLocaleTimeString('pt-PT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-';

                    return (
                      <tr
                        key={order.id}
                        onClick={() => setActiveOrder(order)}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#2a2a2a]' : 'hover:bg-[#201f1f]'
                        }`}
                      >
                        <td className="px-4 py-3 font-mono font-bold text-[#ffb95f]">
                          {order.order_number}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold block text-white truncate max-w-[150px]">
                            {order.customer_name}
                          </span>
                          <span className="text-[11px] text-[#ab8985] block truncate max-w-[150px]">
                            {order.neighborhood}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-heading font-extrabold text-white whitespace-nowrap">
                          {FORMAT_KZ(order.total)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${
                              statusColors[order.status] || 'bg-gray-500/20 text-gray-300'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#ab8985] text-[11px] whitespace-nowrap">
                          {dateFormatted}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Drawer / Card */}
        {activeOrder && (
          <div className="lg:col-span-5 bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl p-5 sm:p-6 flex flex-col gap-5 sticky top-6">
            <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ab8985] block">
                  Detalhes do Pedido
                </span>
                <h3 className="font-mono font-black text-xl text-[#ffb95f]">
                  {activeOrder.order_number}
                </h3>
              </div>

              <button
                onClick={() => {
                  setActiveOrder(null);
                  if (onClearSelectedOrder) onClearSelectedOrder();
                }}
                className="w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-[#353534] flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#ab8985]">
                Alterar Estado do Pedido
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {statusOptions.map((st) => {
                  const isActive = activeOrder.status === st;
                  return (
                    <button
                      key={st}
                      disabled={updatingStatus}
                      onClick={() => handleStatusChange(activeOrder.id, st)}
                      className={`px-2 py-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${
                        isActive
                          ? 'bg-[#ffb95f] text-[#201000] border-[#ffb95f] shadow'
                          : 'bg-[#131313] hover:bg-[#201f1f] text-[#ab8985] border-[#2a2a2a]'
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer Info */}
            <div className="p-4 rounded-2xl bg-[#131313] border border-[#2a2a2a] flex flex-col gap-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Dados do Cliente
              </span>
              <div className="text-xs flex flex-col gap-1.5 text-[#e4beba]">
                <div className="flex items-center justify-between">
                  <span className="text-[#ab8985]">Nome:</span>
                  <span className="font-semibold text-white">{activeOrder.customer_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#ab8985]">Telefone:</span>
                  <a
                    href={`https://wa.me/244${activeOrder.customer_phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#ffb95f] hover:underline inline-flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{activeOrder.customer_phone}</span>
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#ab8985]">Bairro:</span>
                  <span className="font-semibold text-white">{activeOrder.neighborhood}</span>
                </div>
                <div className="flex flex-col gap-0.5 pt-1 border-t border-[#2a2a2a]">
                  <span className="text-[#ab8985]">Endereço / Referência:</span>
                  <span className="text-white font-medium">{activeOrder.delivery_address || 'A combinar'}</span>
                </div>
                {activeOrder.notes && (
                  <div className="flex flex-col gap-0.5 pt-1 border-t border-[#2a2a2a]">
                    <span className="text-[#ab8985]">Observações:</span>
                    <span className="text-amber-300/90 italic font-medium">{activeOrder.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Products in this order */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ab8985]">
                Produtos ({activeOrder.items?.length || 0})
              </span>
              <div className="divide-y divide-[#2a2a2a] max-h-48 overflow-y-auto">
                {activeOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">
                        {item.quantity}x {item.product_name}
                      </span>
                      <span className="text-[11px] text-[#ab8985]">
                        {FORMAT_KZ(item.unit_price)} un.
                      </span>
                    </div>
                    <span className="font-heading font-extrabold text-white">
                      {FORMAT_KZ(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="p-4 rounded-2xl bg-[#201f1f] border border-[#2a2a2a] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#ab8985] uppercase tracking-wider block font-semibold">
                  Total do Pedido
                </span>
                <span className="text-xs text-[#ab8985]">
                  {activeOrder.created_at ? new Date(activeOrder.created_at).toLocaleString('pt-PT') : ''}
                </span>
              </div>
              <span className="font-heading text-xl font-black text-[#ffb95f]">
                {FORMAT_KZ(activeOrder.total)}
              </span>
            </div>

            {/* Direct WhatsApp button with customer */}
            <a
              href={`https://wa.me/244${activeOrder.customer_phone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(activeOrder.customer_name)}%2C%20aqui%20%C3%A9%20da%20Tchemba%20sobre%20o%20seu%20pedido%20${activeOrder.order_number}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contactar Cliente no WhatsApp</span>
            </a>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Order Cancellation */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950/40 border border-red-800/60 flex items-center justify-center text-red-400 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-extrabold text-white">
              Cancelar Pedido?
            </h3>
            <p className="text-xs text-[#ab8985] mt-2 leading-relaxed">
              Tem certeza que deseja cancelar este pedido? Esta ação alterará o estado do pedido para Cancelado e não poderá ser desfeita.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#2a2a2a]">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#2a2a2a] text-xs font-bold text-white cursor-pointer"
              >
                CANCELAR
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-5 py-2 rounded-xl bg-[#d32f2f] hover:bg-[#b71c1c] text-xs font-bold text-white uppercase tracking-wider cursor-pointer"
              >
                CONFIRMAR CANCELAMENTO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criação Manual de Pedidos */}
      <CreateManualOrderModal
        isOpen={createManualModalOpen}
        onClose={() => setCreateManualModalOpen(false)}
        onOrderCreated={() => {
          fetchOrders();
        }}
      />
    </div>
  );
};
