import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { ShieldCheck, UserPlus, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AdminsView: React.FC = () => {
  const { user } = useAuth();
  const [invitedEmail, setInvitedEmail] = useState('');
  const [success, setSuccess] = useState(false);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h2 className="font-heading text-xl sm:text-2xl font-black text-white">
          Gestão de Administradores
        </h2>
        <span className="text-xs text-[#ab8985]">
          Acesso restrito ao sistema de autenticação e credenciais do Supabase Auth
        </span>
      </div>

      <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
        <div>
          <h3 className="font-heading text-base font-bold text-white mb-1">
            Administrador Principal Ativo
          </h3>
          <p className="text-xs text-[#ab8985] mb-4">
            Apenas administradores autenticados com este e-mail no Supabase Authentication podem gerir a loja e consultar dados operacionais.
          </p>

          <div className="p-4 rounded-2xl bg-[#131313] border border-[#2a2a2a] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ffb95f]/15 border border-[#ffb95f]/30 flex items-center justify-center text-[#ffb95f]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {user?.email || 'tchembacrispy@gmail.com'}
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  Super Administrador (Supabase Auth)
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
              Ativo
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-[#2a2a2a]">
          <h3 className="font-heading text-base font-bold text-white mb-1">
            Segurança de Acesso
          </h3>
          <p className="text-xs text-[#ab8985] leading-relaxed">
            O cadastro público de administradores está permanentemente desativado. Novos administradores só podem ser criados ou convidados diretamente pelo painel do Supabase (Authentication &gt; Users &gt; Invite User), garantindo máxima proteção contra acessos não autorizados.
          </p>
        </div>
      </div>
    </div>
  );
};
