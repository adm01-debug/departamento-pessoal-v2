// V15-345
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error('ErrorBoundary:', error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md"><CardHeader><CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" />Erro Inesperado</CardTitle></CardHeader>
            <CardContent className="space-y-4"><p className="text-muted-foreground">Ocorreu um erro inesperado. Por favor, tente novamente.</p><p className="text-sm font-mono bg-muted p-2 rounded">{this.state.error?.message}</p>
              <Button onClick={() => window.location.reload()} className="w-full"><RefreshCw className="h-4 w-4 mr-2" />Recarregar</Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}
