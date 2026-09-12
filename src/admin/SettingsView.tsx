import React, { useState, useEffect } from 'react';
import { dbService } from '../lib/dbService';
import { StoreSettingsRecord } from '../types';
import { Save, Store, Clock, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettingsRecord>({
    store_name: 'Tchemba',
    slogan: 'O Sabor que derrete.',
    phone: '+244 939 779 057',
    whatsapp: '+244 939 779 057',
    email: 'tchembacrispy@gmail.com',
    address: '6PHR+VH8, R. Silva Porto, Huambo, Angola',
    opening_time: '10:00',
    closing_time: '23:30',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const data = await dbService.getStoreSettings();
      if (data) setSettings(data);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await dbService.updateStoreSettings(settings);
    setSaving(false);

    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-[#ab8985]">Carregando configurações...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h2 className="font-heading text-xl sm:text-2xl font-black text-white">
          Configurações da Loja
        </h2>
        <span className="text-xs text-[#ab8985]">
          Edite as informações públicas da Tchemba exibidas no site oficial
        </span>
      </div>

      <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl p-6 sm:p-8 shadow-xl">
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Configurações atualizadas no Supabase e sincronizadas com o site público!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                Nome da Marca / Loja
              </label>
              <input
                type="text"
                required
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                Slogan Oficial
              </label>
              <input
                type="text"
                required
                value={settings.slogan}
                onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                WhatsApp Oficial
              </label>
              <input
                type="text"
                required
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                Telefone de Atendimento
              </label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
              E-mail de Contacto / Administrativo
            </label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
              Endereço Físico no Huambo
            </label>
            <input
              type="text"
              required
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                Horário de Abertura
              </label>
              <input
                type="text"
                required
                value={settings.opening_time}
                onChange={(e) => setSettings({ ...settings, opening_time: e.target.value })}
                placeholder="10:00"
                className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                Horário de Encerramento
              </label>
              <input
                type="text"
                required
                value={settings.closing_time}
                onChange={(e) => setSettings({ ...settings, closing_time: e.target.value })}
                placeholder="23:30"
                className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#2a2a2a] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#d32f2f]/30 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'A guardar...' : 'Guardar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
