import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
interface ErrorStateProps { title?: string; message?: string; onRetry?: () => void; }
export function ErrorState({ title = "Erro ao carregar dados", message = "Ocorreu um erro inesperado. Tente novamente.", onRetry }: ErrorStateProps) {
  return (
    <Alert variant="destructive" className="max-w-md mx-auto"><AlertCircle className="h-4 w-4" /><AlertTitle>{title}</AlertTitle><AlertDescription className="mt-2"><p>{message}</p>{onRetry && <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}><RefreshCw className="h-4 w-4 mr-2" />Tentar novamente</Button>}</AlertDescription></Alert>
  );
}
export function ErrorBoundaryFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return <div className="p-6"><ErrorState title="Algo deu errado" message={error.message} onRetry={resetErrorBoundary} /></div>;
}
export default ErrorState;
