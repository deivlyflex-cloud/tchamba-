import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard, AdminTab } from './AdminDashboard';

interface AdminRouterProps {
  onBackToStore: () => void;
}

export const AdminRouter: React.FC<AdminRouterProps> = ({ onBackToStore }) => {
  const { user, loading } = useAuth();
  const [currentSubRoute, setCurrentSubRoute] = useState<AdminTab>('dashboard');

  useEffect(() => {
    const parseRoute = () => {
      const hash = window.location.hash || '';
      const path = window.location.pathname || '';

      const target = hash.startsWith('#/adm') ? hash.replace('#/adm', '') : path.replace('/adm', '');

      let cleanSub = target.replace(/^\//, '').split('/')[0] as AdminTab;
      if (cleanSub === ('pedido' as any) || cleanSub === 'detalhes-pedido') {
        cleanSub = 'detalhes-pedido';
      }
      if (cleanSub) {
        setCurrentSubRoute(cleanSub);
      } else {
        setCurrentSubRoute('dashboard');
      }
    };

    parseRoute();
    window.addEventListener('hashchange', parseRoute);
    window.addEventListener('popstate', parseRoute);

    return () => {
      window.removeEventListener('hashchange', parseRoute);
      window.removeEventListener('popstate', parseRoute);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131313] flex items-center justify-center text-[#ab8985] text-xs font-semibold">
        A carregar acesso administrativo...
      </div>
    );
  }

  // If not authenticated, always show AdminLogin (protecting all /adm subroutes)
  if (!user) {
    return (
      <AdminLogin
        onSuccess={() => {
          window.location.hash = '/adm/dashboard';
          setCurrentSubRoute('dashboard');
        }}
        onBackToStore={onBackToStore}
      />
    );
  }

  // If authenticated, show AdminDashboard with subroute
  return (
    <AdminDashboard
      initialTab={currentSubRoute}
      onNavigateToStore={onBackToStore}
    />
  );
};
