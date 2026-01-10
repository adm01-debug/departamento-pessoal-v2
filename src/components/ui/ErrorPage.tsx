import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorPageProps { title?: string; message?: string; onRetry?: () => void; className?: string; }

export function ErrorPage({ title = "Algo deu errado", message = "Erro inesperado.", onRetry, className }: ErrorPageProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen text-center p-4", className)}>
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-6">{message}</p>
      {onRetry && <Button onClick={onRetry}><RefreshCw className="h-4 w-4 mr-2" />Tentar novamente</Button>}
    </div>
  );
}
export default ErrorPage;
