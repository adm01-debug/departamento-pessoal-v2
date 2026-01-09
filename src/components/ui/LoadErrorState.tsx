import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface LoadErrorStateProps { title?: string; message?: string; onRetry?: () => void; className?: string; }

export function LoadErrorState({ title = "Erro ao carregar", message = "Não foi possível carregar os dados. Tente novamente.", onRetry, className }: LoadErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4"><AlertCircle className="h-8 w-8 text-destructive" /></div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{message}</p>
      {onRetry && <Button variant="outline" onClick={onRetry}><RefreshCw className="h-4 w-4 mr-2" />Tentar novamente</Button>}
    </div>
  );
}
export default LoadErrorState;
