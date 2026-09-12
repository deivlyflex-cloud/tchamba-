import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#131313] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#d32f2f]/20 border border-[#d32f2f]/40 flex items-center justify-center text-[#d32f2f] mb-4 text-2xl font-bold">
            !
          </div>
          <h1 className="font-heading text-xl md:text-2xl font-black mb-2">
            Tchemba Fast-Food
          </h1>
          <p className="text-sm text-[#ab8985] max-w-md mb-6">
            Ocorreu um problema ao carregar a página. Clique abaixo para reiniciar o cardápio.
          </p>
          <button
            onClick={() => {
              try {
                localStorage.removeItem('tchemba_cart');
                localStorage.removeItem('tchemba_custom_products');
              } catch {
                // Ignore storage errors
              }
              window.location.reload();
            }}
            className="px-6 py-3 rounded-full bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-sm tracking-wide shadow-lg transition-all"
          >
            Recarregar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
