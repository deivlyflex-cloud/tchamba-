import React, { useState, useEffect } from 'react';
import { dbService } from '../lib/dbService';
import { EventOrderRecord } from '../types';
import { FORMAT_KZ } from '../data/products';
import { Calendar, Phone, MapPin, Plus, CheckCircle, Clock, X, MessageCircle } from 'lucide-react';

export const EventsView: React.FC = () => {
  const [events, setEvents] = useState<EventOrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [productName, setProductName] = useState('Produção para Eventos – 20 Cheese Drums');
  const [quantityPackages, setQuantityPackages] = useState(1);
  const [packageType, setPackageType] = useState('20 Cheese Drums');
  const [totalPieces, setTotalPieces] = useState(20);
  const [location, setLocation] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [notes, setNotes] = useState('');
  const [totalValue, setTotalValue] = useState(18100);

  const fetchEvents = async () => {
    setLoading(true);
    const data = await dbService.getEventOrders();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !eventDate || !location) return;

    await dbService.createEventOrder({
      customer_name: customerName,
      customer_phone: customerPhone,
      event_date: eventDate,
      event_time: eventTime || undefined,
      product_name: productName,
      quantity_packages: quantityPackages,
      package_type: packageType,
      total_pieces: totalPieces,
      location,
      neighborhood,
      notes,
      total_value: totalValue,
    });

    setIsModalOpen(false);
    fetchEvents();
  };

  const handleStatusUpdate = async (id: string, newStatus: any) => {
    await dbService.updateEventOrderStatus(id, newStatus);
    setEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, status: newStatus } : ev))
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-white">
            Produção para Eventos & Encomendas
          </h2>
          <span className="text-xs text-[#ab8985]">
            Área dedicada para a gestão de encomendas em grande escala de Cheese Drums para aniversários e festas no Huambo
          </span>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#d32f2f]/30 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>NOVO EVENTO / ENCOMENDA</span>
        </button>
      </div>

      <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-[#ab8985]">Carregando encomendas de eventos...</div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#ab8985]">
            Nenhuma encomenda para eventos registada ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white">
              <thead className="bg-[#131313] text-[#ab8985] uppercase tracking-wider font-bold text-[10px] border-b border-[#2a2a2a]">
                <tr>
                  <th className="px-5 py-3.5">Código</th>
                  <th className="px-5 py-3.5">Cliente</th>
                  <th className="px-5 py-3.5">Data do Evento</th>
                  <th className="px-5 py-3.5">Pacote / Quantidade</th>
                  <th className="px-5 py-3.5">Localização</th>
                  <th className="px-5 py-3.5">Valor</th>
                  <th className="px-5 py-3.5">Estado</th>
                  <th className="px-5 py-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]/60">
                {events.map((ev) => {
                  const dateStr = new Date(ev.event_date).toLocaleDateString('pt-PT');
                  return (
                    <tr key={ev.id} className="hover:bg-[#201f1f] transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-[#ffb95f]">
                        {ev.event_code}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold block text-white">{ev.customer_name}</span>
                        <span className="text-[11px] text-[#ab8985]">{ev.customer_phone}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-white block">{dateStr}</span>
                        {ev.event_time && (
                          <span className="text-[11px] text-[#ab8985]">{ev.event_time}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-[#ffb95f] block">
                          {ev.quantity_packages}x {ev.package_type}
                        </span>
                        <span className="text-[11px] text-[#ab8985]">
                          Total: {ev.total_pieces} unidades
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#e4beba]">
                        <span className="block truncate max-w-[180px]">{ev.location}</span>
                        {ev.neighborhood && (
                          <span className="text-[11px] text-[#ab8985]">{ev.neighborhood}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-heading font-extrabold text-white">
                        {FORMAT_KZ(ev.total_value)}
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={ev.status}
                          onChange={(e) => handleStatusUpdate(ev.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-[#131313] border border-[#2a2a2a] text-[11px] font-bold text-white focus:outline-none focus:border-[#ffb95f]"
                        >
                          <option value="Novo">Novo</option>
                          <option value="Confirmado">Confirmado</option>
                          <option value="Em produção">Em produção</option>
                          <option value="Concluído">Concluído</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <a
                          href={`https://wa.me/244${ev.customer_phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-bold transition-colors cursor-pointer"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#2a2a2a] mb-5">
              <h3 className="font-heading text-lg font-extrabold text-white">
                Registar Encomenda para Evento
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-[#353534] flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                    Nome do Cliente *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Carlos Mendes"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="ex: 939 123 456"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                    Data do Evento *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                    Hora Prevista
                  </label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                  Pacote Selecionado
                </label>
                <select
                  value={packageType}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPackageType(val);
                    if (val === '20 Cheese Drums') {
                      setTotalPieces(20 * quantityPackages);
                      setTotalValue(18100 * quantityPackages);
                      setProductName('Produção para Eventos – 20 Cheese Drums');
                    } else if (val === '30 Cheese Drums') {
                      setTotalPieces(30 * quantityPackages);
                      setTotalValue(27500 * quantityPackages);
                      setProductName('Produção para Eventos – 30 Cheese Drums');
                    } else if (val === '40 Cheese Drums') {
                      setTotalPieces(40 * quantityPackages);
                      setTotalValue(36600 * quantityPackages);
                      setProductName('Produção para Eventos – 40 Cheese Drums');
                    } else if (val === '50 Cheese Drums') {
                      setTotalPieces(50 * quantityPackages);
                      setTotalValue(46000 * quantityPackages);
                      setProductName('Produção para Eventos – 50 Cheese Drums');
                    }
                  }}
                  className="w-full px-4 py-2 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                >
                  <option value="20 Cheese Drums">20 Cheese Drums (18.100 Kz)</option>
                  <option value="30 Cheese Drums">30 Cheese Drums (27.500 Kz)</option>
                  <option value="40 Cheese Drums">40 Cheese Drums (36.600 Kz)</option>
                  <option value="50 Cheese Drums">50 Cheese Drums (46.000 Kz)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                    Local do Evento *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Salão de Festas Huambo"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                    Bairro / Zona
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Bairro Benfica"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                  Valor Total do Evento (Kz)
                </label>
                <input
                  type="number"
                  value={totalValue}
                  onChange={(e) => setTotalValue(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#2a2a2a] text-xs font-bold text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Registar Encomenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
