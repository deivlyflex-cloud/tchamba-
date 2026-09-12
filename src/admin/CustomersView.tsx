import React, { useState, useEffect } from 'react';
import { dbService } from '../lib/dbService';
import { CustomerRecord } from '../types';
import { FORMAT_KZ } from '../data/products';
import { Users, Phone, MapPin, ShoppingBag, Search, MessageCircle } from 'lucide-react';

export const CustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    const data = await dbService.getCustomers();
    setCustomers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.neighborhood && c.neighborhood.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-white">
            Clientes Registados
          </h2>
          <span className="text-xs text-[#ab8985]">
            Histórico e volume de compras de clientes do Huambo através do site público
          </span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ab8985]" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] text-xs text-white placeholder:text-[#ab8985] focus:outline-none focus:border-[#ffb95f]"
          />
        </div>
      </div>

      <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-[#ab8985]">Carregando clientes reais...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#ab8985]">
            Nenhum cliente registado ainda. Conforme os clientes façam pedidos no site, os seus perfis reais serão criados e calculados aqui.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white">
              <thead className="bg-[#131313] text-[#ab8985] uppercase tracking-wider font-bold text-[10px] border-b border-[#2a2a2a]">
                <tr>
                  <th className="px-5 py-3.5">Nome do Cliente</th>
                  <th className="px-5 py-3.5">Telefone / WhatsApp</th>
                  <th className="px-5 py-3.5">Bairro / Localização</th>
                  <th className="px-5 py-3.5">Nº de Pedidos</th>
                  <th className="px-5 py-3.5">Total Gasto</th>
                  <th className="px-5 py-3.5">Último Pedido</th>
                  <th className="px-5 py-3.5 text-right">Contacto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]/60">
                {filteredCustomers.map((cust) => {
                  const lastDate = cust.last_order_at
                    ? new Date(cust.last_order_at).toLocaleDateString('pt-PT')
                    : '-';

                  return (
                    <tr key={cust.id} className="hover:bg-[#201f1f] transition-colors">
                      <td className="px-5 py-3.5 font-bold text-white">{cust.name}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-[#ffb95f]">{cust.phone}</td>
                      <td className="px-5 py-3.5 text-[#ab8985]">{cust.neighborhood || cust.address || 'Huambo'}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full bg-[#2a2a2a] text-xs font-bold text-white">
                          {cust.total_orders || 1}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-heading font-extrabold text-white">
                        {FORMAT_KZ(cust.total_spent)}
                      </td>
                      <td className="px-5 py-3.5 text-[#ab8985]">{lastDate}</td>
                      <td className="px-5 py-3.5 text-right">
                        <a
                          href={`https://wa.me/244${cust.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-bold transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
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
