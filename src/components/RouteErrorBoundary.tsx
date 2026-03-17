import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[RouteErrorBoundary]', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8">
          <div className="p-4 rounded-full bg-destructive/10">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <div className="text-center space-y-2 max-w-md">
            <h2 className="text-xl font-display font-bold text-foreground">
              Algo deu errado nesta página
            </h2>
            <p className="text-sm text-muted-foreground font-body">
              Um erro inesperado ocorreu. Você pode tentar recarregar a página ou voltar ao início.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="mt-4 p-3 bg-muted rounded-lg text-xs text-left overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={this.handleRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Tentar novamente
            </Button>
            <Button onClick={this.handleGoHome} className="gap-2">
              <Home className="h-4 w-4" /> Ir ao início
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
