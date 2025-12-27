import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface Props { children: ReactNode; fallback?: ReactNode; onError?: (error: Error, info: ErrorInfo) => void; }
interface State { hasError: boolean; error: Error | null; }
export class ErrorBoundaryAdvanced extends Component<Props, State> {
  state: State = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { this.props.onError?.(error, info); console.error('ErrorBoundary:', error, info); }
  handleRetry = () => { this.setState({ hasError: false, error: null }); };
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (<div className="flex flex-col items-center justify-center p-8 text-center"><AlertCircle className="h-12 w-12 text-destructive mb-4" /><h2 className="text-lg font-semibold">Algo deu errado</h2><p className="text-sm text-muted-foreground mt-1 mb-4">{this.state.error?.message || 'Erro desconhecido'}</p><Button onClick={this.handleRetry}><RefreshCw className="mr-2 h-4 w-4" />Tentar novamente</Button></div>);
    }
    return this.props.children;
  }
}
