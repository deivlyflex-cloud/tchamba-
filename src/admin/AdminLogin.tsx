import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { getSupabaseConfig, saveSupabaseCredentials } from '../lib/supabase';
import { Lock, Mail, AlertCircle, Key, Database, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToStore }) => {
  const { signIn, isConfigured } = useAuth();
  const [email, setEmail] = useState('tchembacrispy@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Setup modal state in case credentials are not configured
  const [showConfigModal, setShowConfigModal] = useState(!isConfigured);
  const currentConfig = getSupabaseConfig();
  const [configUrl, setConfigUrl] = useState(currentConfig.url || '');
  const [configKey, setConfigKey] = useState(currentConfig.key || '');
  const [configSuccess, setConfigSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor preencha todos os campos.');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setErrorMessage(error);
    } else {
      onSuccess();
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configUrl.trim() || !configKey.trim()) return;

    saveSupabaseCredentials(configUrl, configKey);
    setConfigSuccess(true);
    setTimeout(() => {
      setShowConfigModal(false);
      setConfigSuccess(false);
      window.location.reload();
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-[#131313] text-[#fbf8f5] flex flex-col justify-center items-center p-4 sm:p-6 relative">
      {/* Top action: Back to public store */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] text-xs font-bold text-[#ab8985] hover:text-white border border-[#2a2a2a] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Site Público</span>
        </button>
      </div>

      {/* Supabase Connection Pill Indicator */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={() => setShowConfigModal(true)}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            isConfigured
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/40'
              : 'bg-amber-950/40 text-amber-300 border-amber-800/50 hover:bg-amber-900/40'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>{isConfigured ? 'Supabase Conectado' : 'Configurar Supabase'}</span>
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#d32f2f]/15 border border-[#d32f2f]/30 mb-4 shadow-lg shadow-[#d32f2f]/10">
            <Lock className="w-8 h-8 text-[#d32f2f]" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
            TCHEMBA ADMIN
          </h1>
          <p className="text-xs sm:text-sm text-[#ab8985] mt-1 font-medium">
            Acesso administrativo restrito
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl p-6 sm:p-8 shadow-2xl">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!isConfigured && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs flex flex-col gap-2">
              <span className="font-bold">Aviso de Configuração Supabase</span>
              <p className="text-[11px] text-amber-300/80 leading-relaxed">
                As variáveis de ambiente do Supabase ainda não foram fornecidas. Você pode conectar diretamente clicando abaixo.
              </p>
              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                className="mt-1 text-xs font-bold text-[#ffb95f] hover:underline self-start cursor-pointer"
              >
                Conectar projeto Supabase agora
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-2">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#ab8985]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tchembacrispy@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-sm focus:outline-none focus:border-[#d32f2f] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#ab8985]">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-sm focus:outline-none focus:border-[#d32f2f] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full py-3.5 px-6 rounded-xl bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-heading font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#d32f2f]/30 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'A verificar...' : 'ENTRAR'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#2a2a2a] text-center">
            <span className="text-[11px] text-[#ab8985] block">
              Protegido por Supabase Authentication
            </span>
            <span className="text-[10px] text-[#ab8985]/70 block mt-1">
              Apenas o administrador autorizado possui permissão de login.
            </span>
          </div>
        </div>
      </div>

      {/* Supabase Credentials Setup Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#1c1b1b] border border-[#2a2a2a] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#ffb95f]/15 border border-[#ffb95f]/30 flex items-center justify-center text-[#ffb95f]">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-extrabold text-white">
                  Conexão com o Supabase
                </h3>
                <span className="text-xs text-[#ab8985]">
                  Insira as credenciais do seu projeto Supabase
                </span>
              </div>
            </div>

            <p className="text-xs text-[#ab8985] leading-relaxed mb-5">
              Encontre a <strong>Project URL</strong> e a <strong>anon public key</strong> no painel do seu Supabase em <em>Project Settings &gt; API</em>.
            </p>

            <form onSubmit={handleSaveConfig} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                  Project URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://xyzcompany.supabase.co"
                  value={configUrl}
                  onChange={(e) => setConfigUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#ab8985] mb-1.5">
                  Anon / Public API Key
                </label>
                <input
                  type="text"
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={configKey}
                  onChange={(e) => setConfigKey(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#ffb95f]"
                />
              </div>

              {configSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Credenciais guardadas com sucesso! Atualizando...</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 mt-3 pt-4 border-t border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#2a2a2a] hover:bg-[#353534] text-xs font-bold text-[#ab8985] hover:text-white transition-colors cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Conectar Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
