import React, { useState, useEffect } from 'react';
import { dbService } from '../lib/dbService';
import { OrderRecord } from '../types';
import { FORMAT_KZ } from '../data/products';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  TrendingUp,
  Calendar,
  ArrowRight,
  AlertCircle,
  Check,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateToOrders: () => void;
  onSelectOrder: (order: OrderRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateToOrders, onSelectOrder }) => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'month'>('7d');

  const fetchDashboardData = async () => {
    setLoading(true);
    const data = await dbService.getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Today stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter((o) => o.created_at?.startsWith(todayStr));

  const faturamentoHoje = todayOrders.reduce((sum, o) => {
    if (o.status !== 'Cancelado') return sum + Number(o.total || 0);
    return sum;
  }, 0);

  const totalPedidosHoje = todayOrders.length;
  const pedidosPendentes = orders.filter((o) => o.status === 'Novo' || o.status === 'Confirmado' || o.status === 'Em preparação').length;
  const pedidosAguardandoAprovacao = orders.filter((o) => o.status === 'Novo').length;
  const pedidosConcluidos = orders.filter((o) => o.status === 'Concluído').length;

  const handleApproveQuick = async (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await dbService.updateOrderStatus(orderId, 'Confirmado');
    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'Confirmado' } : o))
      );
    }
  };

  // Chart data: sales by day for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const displayDate = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;

    const dayOrders = orders.filter((o) => o.created_at?.startsWith(dateStr) && o.status !== 'Cancelado');
    const revenue = dayOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const count = dayOrders.length;

    return { dateStr, displayDate, count, revenue };
  });

  const maxRevenue = Math.max(...last7Days.map((d) => d.revenue), 1);

  const recentOrders = orders.slice(0, 6);

  if (loading) {
    return (
      <div className="p-8 text-center text-[#ab8985] text-sm">
        Carregando dados do painel administrativo...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Banner de Pedidos Aguardando Aprovação */}
      {pedidosAguardandoAprovacao > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/35 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-sm font-bold text-amber-300 block">
                {pedidosAguardandoAprovacao === 1
                  ? 'Existe 1 pedido novo aguardando aprovação manual'
                  : `Existem ${pedidosAguardandoAprovacao} pedidos novos aguardando aprovação manual`}
              </span>
              <span className="text-xs text-amber-200/70">
                Os pedidos devem ser aprovados antes de serem confirmados e encaminhados para a cozinha.
              </span>
            </div>
          </div>
          <button
            onClick={onNavigateToOrders}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-[#1a1100] font-bold text-xs uppercase tracking-wider self-start sm:self-auto transition-all cursor-pointer shadow whitespace-nowrap"
          >
            Aprovar Pedidos ({pedidosAguardandoAprovacao})
          </button>
        </div>
      )}

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ab8985]">
              Faturamento hoje
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#ffb95f]/15 text-[#ffb95f] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-heading text-2xl font-black text-white">
              {FORMAT_KZ(faturamentoHoje)}
            </span>
            <span className="text-[11px] text-[#ab8985] block mt-0.5">
              Calculado a partir dos pedidos reais
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ab8985]">
              Pedidos hoje
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#d32f2f]/15 text-[#ffb3ac] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-heading text-2xl font-black text-white">
              {totalPedidosHoje}
            </span>
            <span className="text-[11px] text-[#ab8985] block mt-0.5">
              Registados durante o dia
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ab8985]">
              Pendentes
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-heading text-2xl font-black text-amber-400">
              {pedidosPendentes}
            </span>
            <span className="text-[11px] text-[#ab8985] block mt-0.5">
              Aguardando entrega ou preparo
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ab8985]">
              Concluídos
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-heading text-2xl font-black text-emerald-400">
              {pedidosConcluidos}
            </span>
            <span className="text-[11px] text-[#ab8985] block mt-0.5">
              Pedidos finalizados com sucesso
            </span>
          </div>
        </div>
      </div>

      {/* Chart: Vendas dos últimos 7 dias */}
      <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-6 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#ffb95f]" />
              <span>Vendas dos últimos 7 dias</span>
            </h3>
            <span className="text-xs text-[#ab8985]">
              Total faturado e quantidade de pedidos diários
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#131313] p-1 rounded-xl border border-[#2a2a2a] self-start">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === '7d' ? 'bg-[#2a2a2a] text-white' : 'text-[#ab8985] hover:text-white'
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === '30d' ? 'bg-[#2a2a2a] text-white' : 'text-[#ab8985] hover:text-white'
              }`}
            >
              30 dias
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === 'month' ? 'bg-[#2a2a2a] text-white' : 'text-[#ab8985] hover:text-white'
              }`}
            >
              Este mês
            </button>
          </div>
        </div>

        {/* Bar Graph Visual Representation */}
        <div className="h-56 flex items-end justify-between gap-2 pt-6 border-b border-[#2a2a2a] pb-2">
          {last7Days.map((day) => {
            const heightPercent = Math.max((day.revenue / maxRevenue) * 100, 6);
            return (
              <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                {/* Tooltip on hover */}
                <div className="text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#131313] border border-[#2a2a2a] px-2 py-1 rounded shadow-lg pointer-events-none">
                  {day.count} ped. • {FORMAT_KZ(day.revenue)}
                </div>
                <div className="w-full max-w-[42px] bg-[#2a2a2a] rounded-t-lg overflow-hidden flex flex-col justify-end transition-all group-hover:bg-[#353534]">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-[#d32f2f] to-[#ffb95f] rounded-t-lg"
                  />
                </div>
                <span className="text-[11px] font-semibold text-[#ab8985] group-hover:text-white transition-colors">
                  {day.displayDate}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 text-xs text-[#ab8985]">
          <span>Dados atualizados diretamente do Supabase</span>
          <span>Valores expressos em Kwanzas (Kz)</span>
        </div>
      </div>

      {/* Pedidos Recentes */}
      <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#2a2a2a] flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-white">
              Pedidos Recentes
            </h3>
            <span className="text-xs text-[#ab8985]">
              Últimos pedidos registados pelo site público
            </span>
          </div>

          <button
            onClick={onNavigateToOrders}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ffb95f] hover:text-white transition-colors cursor-pointer"
          >
            <span>Ver todos os pedidos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#ab8985]">
            Nenhum pedido encontrado. Quando clientes realizarem pedidos pelo site, eles aparecerão aqui automaticamente.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white">
              <thead className="bg-[#131313] text-[#ab8985] uppercase tracking-wider font-bold text-[10px] border-b border-[#2a2a2a]">
                <tr>
                  <th className="px-5 py-3.5">Número</th>
                  <th className="px-5 py-3.5">Cliente</th>
                  <th className="px-5 py-3.5">Total</th>
                  <th className="px-5 py-3.5">Estado</th>
                  <th className="px-5 py-3.5">Data / Hora</th>
                  <th className="px-5 py-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]/60">
                {recentOrders.map((order) => {
                  const statusColors: any = {
                    Novo: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                    Confirmado: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                    'Em preparação': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                    Pronto: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                    Concluído: 'bg-emerald-900/30 text-emerald-300 border-emerald-800/40',
                    Cancelado: 'bg-red-500/20 text-red-400 border-red-500/30',
                  };

                  const formattedDate = order.created_at
                    ? new Date(order.created_at).toLocaleString('pt-PT', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-';

                  return (
                    <tr
                      key={order.id}
                      onClick={() => onSelectOrder(order)}
                      className="hover:bg-[#201f1f] transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3.5 font-mono font-bold text-[#ffb95f]">
                        {order.order_number}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold block text-white">{order.customer_name}</span>
                        <span className="text-[11px] text-[#ab8985]">{order.neighborhood}</span>
                      </td>
                      <td className="px-5 py-3.5 font-heading font-extrabold text-white">
                        {FORMAT_KZ(order.total)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            order.status === 'Novo'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                              : statusColors[order.status] || 'bg-gray-500/20 text-gray-300'
                          }`}
                        >
                          {order.status === 'Novo' ? 'Aguardando Aprovação' : order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#ab8985] text-[11px]">
                        {formattedDate}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {order.status === 'Novo' && (
                            <button
                              onClick={(e) => handleApproveQuick(order.id, e)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow transition-all cursor-pointer"
                              title="Aprovar Pedido Agora"
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Aprovar</span>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectOrder(order);
                            }}
                            className="px-3 py-1 rounded-lg bg-[#2a2a2a] hover:bg-[#353534] text-xs font-semibold text-white transition-colors cursor-pointer"
                          >
                            Detalhes
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
