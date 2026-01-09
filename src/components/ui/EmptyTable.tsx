import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileSearch, Plus } from "lucide-react";

interface EmptyTableProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyTable({ title = "Nenhum dado encontrado", description = "Não há registros para exibir.", icon, action, className }: EmptyTableProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {icon || <FileSearch className="h-12 w-12 text-muted-foreground mb-4" />}
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
      {action && <Button className="mt-4" onClick={action.onClick}><Plus className="h-4 w-4 mr-2" />{action.label}</Button>}
    </div>
  );
}
export default EmptyTable;
