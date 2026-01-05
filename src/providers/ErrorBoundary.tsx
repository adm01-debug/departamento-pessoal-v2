import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("Error caught by boundary:", error, errorInfo); }
  handleReset = () => { this.setState({ hasError: false, error: undefined }); };
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen flex items-center justify-center p-4"><Card className="max-w-md w-full"><CardHeader className="text-center"><AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" /><CardTitle>Algo deu errado</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground text-center">Ocorreu um erro inesperado. Por favor, tente novamente ou volte para a página inicial.</p>{this.state.error && <details className="text-xs bg-muted p-2 rounded"><summary className="cursor-pointer">Detalhes do erro</summary><pre className="mt-2 overflow-auto">{this.state.error.message}</pre></details>}<div className="flex gap-2"><Button className="flex-1" onClick={this.handleReset}><RefreshCw className="h-4 w-4 mr-2" />Tentar novamente</Button><Button variant="outline" className="flex-1" onClick={() => window.location.href = "/"}><Home className="h-4 w-4 mr-2" />Início</Button></div></CardContent></Card></div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
