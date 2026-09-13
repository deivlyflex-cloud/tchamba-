import React, { useState, useEffect, useMemo } from 'react';
import { dbService } from '../lib/dbService';
import { OrderRecord, OrderStatus } from '../types';
import { FORMAT_KZ } from '../data/products';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Award,
  Calendar,
  Filter,
  Clock,
  Printer,
  RotateCcw,
  Layers,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';

type PresetPeriod = 'today' | 'yesterday' | '7d' | '30d' | 'month' | 'all' | 'custom';
type RevenueCriteria = 'completed' | 'all_approved' | 'all_valid';

export const ReportsView: React.FC = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Date filters
  const [period, setPeriod] = useState<PresetPeriod>('month');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Revenue criteria
  const [revenueCriteria, setRevenueCriteria] = useState<RevenueCriteria>('completed');
  const [activeTab, setActiveTab] = useState<'ranking' | 'pedidos'>('ranking');

  // Helper date strings
  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getYesterdayStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  };
  const getDaysAgoStr = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  };
  const getFirstDayOfMonthStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}-01`;
  };

  // Initialize with current month
  useEffect(() => {
    setStartDate(getFirstDayOfMonthStr());
    setEndDate(getTodayStr());
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await dbService.getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Preset Clicks
  const handleApplyPreset = (preset: PresetPeriod) => {
    setPeriod(preset);
    const today = getTodayStr();

    switch (preset) {
      case 'today':
        setStartDate(today);
        setEndDate(today);
        break;
      case 'yesterday':
        const y = getYesterdayStr();
        setStartDate(y);
        setEndDate(y);
        break;
      case '7d':
        setStartDate(getDaysAgoStr(7));
        setEndDate(today);
        break;
      case '30d':
        setStartDate(getDaysAgoStr(30));
        setEndDate(today);
        break;
      case 'month':
        setStartDate(getFirstDayOfMonthStr());
        setEndDate(today);
        break;
      case 'all':
        setStartDate('');
        setEndDate('');
        break;
      case 'custom':
        break;
    }
  };

  const handleCustomDateChange = (type: 'start' | 'end', val: string) => {
    setPeriod('custom');
    if (type === 'start') {
      setStartDate(val);
    } else {
      setEndDate(val);
    }
  };

  const handleClearDates = () => {
    setPeriod('all');
    setStartDate('');
    setEndDate('');
  };

  // Filter orders based on manual dates
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (!o.created_at) return true;

      if (startDate) {
        const startObj = new Date(`${startDate}T00:00:00`);
        const orderObj = new Date(o.created_at);
        if (orderObj < startObj) return false;
      }

      if (endDate) {
        const endObj = new Date(`${endDate}T23:59:59.999`);
        const orderObj = new Date(o.created_at);
        if (orderObj > endObj) return false;
      }

      return true;
    });
  }, [orders, startDate, endDate]);

  // Breakdown of orders by status
  const completedOrders = useMemo(
    () => filteredOrders.filter((o) => o.status === 'Concluído'),
    [filteredOrders]
  );

  const inProgressApprovedOrders = useMemo(
    () =>
      filteredOrders.filter(
        (o) =>
          o.status === 'Confirmado' ||
          o.status === 'Em preparação' ||
          o.status === 'Pronto'
      ),
    [filteredOrders]
  );

  const pendingOrders = useMemo(
    () => filteredOrders.filter((o) => o.status === 'Novo'),
    [filteredOrders]
  );

  const cancelledOrders = useMemo(
    () => filteredOrders.filter((o) => o.status === 'Cancelado'),
    [filteredOrders]
  );

  // Financial values
  const faturamentoConcluido = useMemo(
    () => completedOrders.reduce((sum, o) => sum + Number(o.total || 0), 0),
    [completedOrders]
  );

  const faturamentoEmAndamento = useMemo(
    () => inProgressApprovedOrders.reduce((sum, o) => sum + Number(o.total || 0), 0),
    [inProgressApprovedOrders]
  );

  const faturamentoPendente = useMemo(
    () => pendingOrders.reduce((sum, o) => sum + Number(o.total || 0), 0),
    [pendingOrders]
  );

  const faturamentoCancelado = useMemo(
    () => cancelledOrders.reduce((sum, o) => sum + Number(o.total || 0), 0),
    [cancelledOrders]
  );

  // Orders that count as revenue according to chosen criteria
  const revenueContributingOrders = useMemo(() => {
    if (revenueCriteria === 'completed') {
      return completedOrders;
    }
    if (revenueCriteria === 'all_approved') {
      return [...completedOrders, ...inProgressApprovedOrders];
    }
    // all_valid
    return filteredOrders.filter((o) => o.status !== 'Cancelado');
  }, [revenueCriteria, completedOrders, inProgressApprovedOrders, filteredOrders]);

  const displayedRevenue = useMemo(() => {
    return revenueContributingOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  }, [revenueContributingOrders]);

  const averageTicket = useMemo(() => {
    if (revenueContributingOrders.length === 0) return 0;
    return displayedRevenue / revenueContributingOrders.length;
  }, [displayedRevenue, revenueContributingOrders]);

  // Product ranking based on chosen criteria
  const rankedProducts = useMemo(() => {
    const stats: { [name: string]: { quantity: number; revenue: number } } = {};

    revenueContributingOrders.forEach((o) => {
      o.items?.forEach((it) => {
        if (!stats[it.product_name]) {
          stats[it.product_name] = { quantity: 0, revenue: 0 };
        }
        stats[it.product_name].quantity += it.quantity;
        stats[it.product_name].revenue += Number(it.subtotal || 0);
      });
    });

    return Object.entries(stats)
      .map(([name, val]) => ({ name, ...val }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [revenueContributingOrders]);

  const handlePrint = () => {
    window.print();
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <DollarSign className="w-6 h-6 text-[#ffb95f]" />
            <span>Relatórios Financeiros & Vendas</span>
          </h2>
          <span className="text-xs text-[#ab8985] block mt-0.5">
            Faturamento oficial contabilizado a partir de pedidos <strong>concluídos e aprovados</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="px-3 py-2 rounded-xl bg-[#1c1b1b] hover:bg-[#252424] text-xs font-bold text-white border border-[#2a2a2a] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Atualizar dados"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#ffb95f]' : ''}`} />
            <span>Atualizar</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-[#2a2a2a] hover:bg-[#353534] text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Imprimir relatório financeiro"
          >
            <Printer className="w-3.5 h-3.5 text-[#ffb95f]" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* FILTROS DE DATA E PERÍODO (MANUAL E ATALHOS) */}
      <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded-3xl flex flex-col gap-4 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#2a2a2a]">
          {/* Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ab8985] mr-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#ffb95f]" />
              <span>Período:</span>
            </span>

            {[
              { id: 'today', label: 'Hoje' },
              { id: 'yesterday', label: 'Ontem' },
              { id: '7d', label: 'Últimos 7 dias' },
              { id: '30d', label: 'Últimos 30 dias' },
              { id: 'month', label: 'Este mês' },
              { id: 'all', label: 'Todo o Histórico' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleApplyPreset(item.id as PresetPeriod)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  period === item.id
                    ? 'bg-[#ffb95f] text-black font-extrabold shadow'
                    : 'bg-[#131313] border border-[#2a2a2a] text-[#ab8985] hover:text-white hover:border-[#353534]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Active filter summary pill */}
          <div className="text-xs text-[#ab8985] flex items-center gap-2 self-start lg:self-auto bg-[#131313] px-3 py-1.5 rounded-xl border border-[#2a2a2a]">
            <Filter className="w-3.5 h-3.5 text-[#ffb95f]" />
            <span>
              {startDate && endDate ? (
                <>
                  De <strong className="text-white">{formatDateDisplay(startDate)}</strong> até{' '}
                  <strong className="text-white">{formatDateDisplay(endDate)}</strong>
                </>
              ) : startDate ? (
                <>A partir de <strong className="text-white">{formatDateDisplay(startDate)}</strong></>
              ) : endDate ? (
                <>Até <strong className="text-white">{formatDateDisplay(endDate)}</strong></>
              ) : (
                <strong className="text-white">Todo o período</strong>
              )}
              {' '}• <span className="text-[#ffb95f] font-bold">{filteredOrders.length}</span> pedidos
            </span>
          </div>
        </div>

        {/* INPUTS PARA DATA MANUAL (Data Início e Data Fim) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white whitespace-nowrap">
                Data Inicial:
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleCustomDateChange('start', e.target.value)}
                className="bg-[#131313] border border-[#2a2a2a] focus:border-[#ffb95f] rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white whitespace-nowrap">
                Data Final:
              </span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleCustomDateChange('end', e.target.value)}
                className="bg-[#131313] border border-[#2a2a2a] focus:border-[#ffb95f] rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
              />
            </div>

            {(startDate || endDate) && (
              <button
                onClick={handleClearDates}
                className="px-3 py-2 rounded-xl bg-[#2a2a2a] hover:bg-[#353534] text-xs font-bold text-[#ab8985] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                title="Limpar seleção de datas"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar Datas</span>
              </button>
            )}
          </div>

          {/* CRITÉRIO DE FATURAMENTO SELETOR */}
          <div className="flex items-center gap-2 bg-[#131313] p-1 rounded-xl border border-[#2a2a2a] self-start sm:self-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ab8985] px-2">
              Critério:
            </span>
            <button
              onClick={() => setRevenueCriteria('completed')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                revenueCriteria === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-[#ab8985] hover:text-white'
              }`}
              title="Conta apenas pedidos com status Concluído (recomendado)"
            >
              Concluídos & Aprovados
            </button>
            <button
              onClick={() => setRevenueCriteria('all_approved')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                revenueCriteria === 'all_approved'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'text-[#ab8985] hover:text-white'
              }`}
              title="Inclui pedidos aprovados em preparação ou a caminho"
            >
              Todos Aprovados
            </button>
          </div>
        </div>
      </div>

      {/* CARDS DE FATURAMENTO E KPIS FINANCEIROS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Faturamento Concluído (Destaque Principal) */}
        <div className="bg-[#1c1b1b] border-2 border-emerald-500/40 p-5 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Faturamento Realizado
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-heading text-xl sm:text-2xl font-black text-white block mt-1.5">
              {FORMAT_KZ(faturamentoConcluido)}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#2a2a2a] flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-bold">
              {completedOrders.length} pedidos
            </span>
            <span className="text-[#ab8985]">Concluídos & Aprovados</span>
          </div>
        </div>

        {/* Card 2: Faturamento Em Andamento (Aprovados em preparo ou entrega) */}
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                A Receber (Em Andamento)
              </span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-heading text-xl sm:text-2xl font-black text-amber-400 block mt-1.5">
              {FORMAT_KZ(faturamentoEmAndamento)}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#2a2a2a] flex items-center justify-between text-[11px]">
            <span className="text-amber-400 font-bold">
              {inProgressApprovedOrders.length} pedidos
            </span>
            <span className="text-[#ab8985]">Aprovados em produção</span>
          </div>
        </div>

        {/* Card 3: Ticket Médio */}
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ab8985] block">
                Ticket Médio
              </span>
              <TrendingUp className="w-4 h-4 text-[#ffb95f]" />
            </div>
            <span className="font-heading text-xl sm:text-2xl font-black text-white block mt-1.5">
              {FORMAT_KZ(averageTicket)}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#2a2a2a] flex items-center justify-between text-[11px]">
            <span className="text-[#ffb95f] font-bold">
              {revenueContributingOrders.length} faturados
            </span>
            <span className="text-[#ab8985]">Por pedido</span>
          </div>
        </div>

        {/* Card 4: Total de Pedidos no Período */}
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ab8985] block">
                Total de Pedidos
              </span>
              <ShoppingBag className="w-4 h-4 text-[#ffb3ac]" />
            </div>
            <span className="font-heading text-xl sm:text-2xl font-black text-white block mt-1.5">
              {filteredOrders.length}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#2a2a2a] flex items-center justify-between text-[11px]">
            <span className="text-white font-bold">
              {pendingOrders.length} pendentes
            </span>
            <span className="text-[#ab8985]">No período selecionado</span>
          </div>
        </div>

        {/* Card 5: Pedidos Cancelados */}
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ab8985] block">
                Pedidos Cancelados
              </span>
              <XCircle className="w-4 h-4 text-red-400" />
            </div>
            <span className="font-heading text-xl sm:text-2xl font-black text-red-400 block mt-1.5">
              {cancelledOrders.length}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#2a2a2a] flex items-center justify-between text-[11px]">
            <span className="text-red-400/80 font-bold">
              {FORMAT_KZ(faturamentoCancelado)}
            </span>
            <span className="text-[#ab8985]">Não faturado</span>
          </div>
        </div>
      </div>

      {/* SEÇÃO PRINCIPAL: RANKING DE PRODUTOS OU EXTRATO DE PEDIDOS */}
      <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl overflow-hidden shadow-xl">
        {/* Tab switch header */}
        <div className="p-5 sm:p-6 border-b border-[#2a2a2a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('ranking')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'ranking'
                  ? 'bg-[#ffb95f] text-black shadow font-extrabold'
                  : 'bg-[#131313] text-[#ab8985] hover:text-white border border-[#2a2a2a]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Ranking de Produtos Vendidos</span>
              <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px]">
                {rankedProducts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('pedidos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'pedidos'
                  ? 'bg-[#ffb95f] text-black shadow font-extrabold'
                  : 'bg-[#131313] text-[#ab8985] hover:text-white border border-[#2a2a2a]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Extrato de Pedidos do Período</span>
              <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px]">
                {filteredOrders.length}
              </span>
            </button>
          </div>

          <span className="text-xs text-[#ab8985]">
            Mostrando valores com critério:{' '}
            <strong className="text-white">
              {revenueCriteria === 'completed'
                ? 'Concluídos & Aprovados'
                : revenueCriteria === 'all_approved'
                ? 'Todos Aprovados'
                : 'Todos os Pedidos'}
            </strong>
          </span>
        </div>

        {/* TAB 1: RANKING DE PRODUTOS */}
        {activeTab === 'ranking' && (
          <div>
            {rankedProducts.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#ab8985] flex flex-col items-center gap-2">
                <AlertCircle className="w-8 h-8 text-[#ab8985]/40" />
                <span>Nenhum faturamento de produto registado para as datas e critérios selecionados.</span>
                <span className="text-[11px] text-[#ab8985]/70">
                  Tente alterar o período ou selecionar "Todos Aprovados".
                </span>
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
                      <th className="px-5 py-3.5 text-right">% do Faturamento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a2a]/60">
                    {rankedProducts.map((prod, index) => {
                      const percent = displayedRevenue > 0
                        ? ((prod.revenue / displayedRevenue) * 100).toFixed(1)
                        : '0.0';

                      return (
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
                          <td className="px-5 py-3.5 text-right text-[#ab8985] font-mono">
                            {percent}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EXTRATO DE PEDIDOS DETALHADOS NO PERÍODO */}
        {activeTab === 'pedidos' && (
          <div>
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#ab8985]">
                Nenhum pedido encontrado no intervalo de datas selecionado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-white">
                  <thead className="bg-[#131313] text-[#ab8985] uppercase tracking-wider font-bold text-[10px] border-b border-[#2a2a2a]">
                    <tr>
                      <th className="px-5 py-3.5">Nº Pedido</th>
                      <th className="px-5 py-3.5">Cliente</th>
                      <th className="px-5 py-3.5">Data / Hora</th>
                      <th className="px-5 py-3.5 text-center">Estado</th>
                      <th className="px-5 py-3.5 text-center">Itens</th>
                      <th className="px-5 py-3.5 text-right">Valor Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a2a]/60">
                    {filteredOrders.map((order) => {
                      const isCompleted = order.status === 'Concluído';
                      const isCancelled = order.status === 'Cancelado';
                      const isApproved =
                        order.status === 'Confirmado' ||
                        order.status === 'Em preparação' ||
                        order.status === 'Pronto';

                      return (
                        <tr key={order.id} className="hover:bg-[#201f1f] transition-colors">
                          <td className="px-5 py-3.5 font-mono font-bold text-[#ffb95f]">
                            {order.order_number}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-bold text-white block">{order.customer_name}</span>
                            <span className="text-[10px] text-[#ab8985]">{order.neighborhood || order.delivery_address || 'Huambo'}</span>
                          </td>
                          <td className="px-5 py-3.5 text-[#ab8985]">
                            {order.created_at
                              ? new Date(order.created_at).toLocaleString('pt-PT', {
                                  dateStyle: 'short',
                                  timeStyle: 'short',
                                })
                              : '-'}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : isApproved
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : isCancelled
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-center font-bold text-[#ab8985]">
                            {order.items?.length || 0}
                          </td>
                          <td className="px-5 py-3.5 text-right font-heading font-extrabold text-white">
                            {FORMAT_KZ(Number(order.total || 0))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
