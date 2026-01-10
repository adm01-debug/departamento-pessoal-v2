import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface NotFoundPageProps { onGoHome?: () => void; className?: string; }

export function NotFoundPage({ onGoHome, className }: NotFoundPageProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen text-center p-4", className)}>
      <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
      <p className="text-xl mb-2">Página não encontrada</p>
      <p className="text-muted-foreground mb-6">A página que você procura não existe.</p>
      {onGoHome && <Button onClick={onGoHome}><Home className="h-4 w-4 mr-2" />Voltar</Button>}
    </div>
  );
}
export default NotFoundPage;
