import React, { useState, useEffect } from 'react';
import { dbService } from '../lib/dbService';
import { OrderRecord } from '../types';
import { FORMAT_KZ } from '../data/products';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, CheckCircle, XCircle, Award } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'today' | 'yesterday' | '7d' | '30d' | 'month' | 'all'>('7d');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await dbService.getOrders();
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  // Filter orders based on chosen period
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const filteredOrders = orders.filter((o) => {
    if (!o.created_at) return true;
    const orderDate = new Date(o.created_at);

    if (period === 'today') {
      return o.created_at.startsWith(todayStr);
    }
    if (period === 'yesterday') {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yStr = y.toISOString().split('T')[0];
      return o.created_at.startsWith(yStr);
    }
    if (period === '7d') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return orderDate >= sevenDaysAgo;
    }
    if (period === '30d') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return orderDate >= thirtyDaysAgo;
    }
    if (period === 'month') {
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    }
    return true;
  });

  // Calculate real metrics
  const validOrders = filteredOrders.filter((o) => o.status !== 'Cancelado');
  const totalRevenue = validOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const totalOrdersCount = filteredOrders.length;
  const averageTicket = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;
  const completedOrdersCount = filteredOrders.filter((o) => o.status === 'Concluído').length;
  const cancelledOrdersCount = filteredOrders.filter((o) => o.status === 'Cancelado').length;

  // Best selling products ranking
  const productStats: { [name: string]: { quantity: number; revenue: number } } = {};

  validOrders.forEach((o) => {
    o.items?.forEach((it) => {
      if (!productStats[it.product_name]) {
        productStats[it.product_name] = { quantity: 0, revenue: 0 };
      }
      productStats[it.product_name].quantity += it.quantity;
      productStats[it.product_name].revenue += Number(it.subtotal || 0);
    });
  });

  const rankedProducts = Object.entries(productStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.quantity - a.quantity);

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Period Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-white">
            Relatórios Financeiros & Vendas
          </h2>
          <span className="text-xs text-[#ab8985]">
            Métricas calculadas exclusivamente com base nos pedidos reais do Supabase
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#131313] p-1 rounded-xl border border-[#2a2a2a] self-start sm:self-auto overflow-x-auto max-w-full">
          {[
            { id: 'today', label: 'Hoje' },
            { id: 'yesterday', label: 'Ontem' },
            { id: '7d', label: 'Últimos 7 dias' },
            { id: '30d', label: 'Últimos 30 dias' },
            { id: 'month', label: 'Este mês' },
            { id: 'all', label: 'Todos' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                period === item.id ? 'bg-[#2a2a2a] text-white shadow' : 'text-[#ab8985] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ab8985] block">
            Faturamento Total
          </span>
          <span className="font-heading text-xl sm:text-2xl font-black text-[#ffb95f] block mt-1">
            {FORMAT_KZ(totalRevenue)}
          </span>
          <span className="text-[10px] text-[#ab8985] mt-1 block">Pedidos válidos</span>
        </div>

        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ab8985] block">
            Número de Pedidos
          </span>
          <span className="font-heading text-xl sm:text-2xl font-black text-white block mt-1">
            {totalOrdersCount}
          </span>
          <span className="text-[10px] text-[#ab8985] mt-1 block">No período selecionado</span>
        </div>

        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ab8985] block">
            Ticket Médio
          </span>
          <span className="font-heading text-xl sm:text-2xl font-black text-white block mt-1">
            {FORMAT_KZ(averageTicket)}
          </span>
          <span className="text-[10px] text-[#ab8985] mt-1 block">Por pedido efetuado</span>
        </div>

        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ab8985] block">
            Pedidos Concluídos
          </span>
          <span className="font-heading text-xl sm:text-2xl font-black text-emerald-400 block mt-1">
            {completedOrdersCount}
          </span>
          <span className="text-[10px] text-[#ab8985] mt-1 block">Entregas finalizadas</span>
        </div>

        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ab8985] block">
            Pedidos Cancelados
          </span>
          <span className="font-heading text-xl sm:text-2xl font-black text-red-400 block mt-1">
            {cancelledOrdersCount}
          </span>
          <span className="text-[10px] text-[#ab8985] mt-1 block">Desistências / cancelamentos</span>
        </div>
      </div>

      {/* Ranking: Produtos Mais Vendidos */}
      <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#2a2a2a] flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#ffb95f]" />
              <span>Produtos Mais Vendidos (Ranking)</span>
            </h3>
            <span className="text-xs text-[#ab8985]">
              Ordenado por volume total de vendas no período
            </span>
          </div>
        </div>

        {rankedProducts.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#ab8985]">
            Nenhum dado de vendas registado no período selecionado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white">
              <thead className="bg-[#131313] text-[#ab8985] uppercase tracking-wider font-bold text-[10px] border-b border-[#2a2a2a]">
                <tr>
                  <th className="px-5 py-3.5">Posição</th>
                  <th className="px-5 py-3.5">Nome do Produto</th>
                  <th className="px-5 py-3.5 text-center">Quantidade Vendida</th>
                  <th className="px-5 py-3.5 text-right">Faturamento Gerado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]/60">
                {rankedProducts.map((prod, index) => (
                  <tr key={prod.name} className="hover:bg-[#201f1f] transition-colors">
                    <td className="px-5 py-3.5 font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                          index === 0
                            ? 'bg-[#ffb95f] text-black font-extrabold'
                            : index === 1
                            ? 'bg-gray-300 text-black font-extrabold'
                            : index === 2
                            ? 'bg-amber-700 text-white font-extrabold'
                            : 'bg-[#2a2a2a] text-[#ab8985]'
                        }`}
                      >
                        {index + 1}º
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-white">{prod.name}</td>
                    <td className="px-5 py-3.5 text-center font-heading font-extrabold text-[#ffb95f]">
                      {prod.quantity} un.
                    </td>
                    <td className="px-5 py-3.5 text-right font-heading font-extrabold text-white">
                      {FORMAT_KZ(prod.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
