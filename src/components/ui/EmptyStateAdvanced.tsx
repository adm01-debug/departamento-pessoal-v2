import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileX, Search, Inbox, Plus, RefreshCw, AlertCircle } from "lucide-react";

type EmptyStateVariant = "default" | "search" | "error" | "no-data" | "no-results";

interface EmptyStateAdvancedProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  action?: { label: string; onClick: () => void; variant?: "default" | "outline" | "secondary" };
  secondaryAction?: { label: string; onClick: () => void };
  children?: React.ReactNode;
}

const defaultContent: Record<EmptyStateVariant, { icon: React.ReactNode; title: string; description: string }> = {
  default: { icon: <Inbox className="h-12 w-12" />, title: "Nenhum item", description: "Não há itens para exibir no momento." },
  search: { icon: <Search className="h-12 w-12" />, title: "Nenhum resultado", description: "Não encontramos resultados para sua busca. Tente usar termos diferentes." },
  error: { icon: <AlertCircle className="h-12 w-12" />, title: "Algo deu errado", description: "Ocorreu um erro ao carregar os dados. Por favor, tente novamente." },
  "no-data": { icon: <FileX className="h-12 w-12" />, title: "Sem dados", description: "Ainda não há dados cadastrados. Comece adicionando o primeiro item." },
  "no-results": { icon: <Search className="h-12 w-12" />, title: "Sem resultados", description: "Nenhum item corresponde aos filtros aplicados." },
};

export function EmptyStateAdvanced({ variant = "default", title, description, icon, className, action, secondaryAction, children }: EmptyStateAdvancedProps) {
  const content = defaultContent[variant];

  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4 text-muted-foreground">
          {icon || content.icon}
        </div>
        <h3 className="text-lg font-semibold mb-1">{title || content.title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-4">{description || content.description}</p>
        {children}
        {(action || secondaryAction) && (
          <div className="flex items-center gap-2 mt-2">
            {action && (
              <Button variant={action.variant || "default"} onClick={action.onClick}>
                {variant === "no-data" && <Plus className="h-4 w-4 mr-1" />}
                {variant === "error" && <RefreshCw className="h-4 w-4 mr-1" />}
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="outline" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default EmptyStateAdvanced;
