import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, Check, X } from "lucide-react";

type SavingStatus = "idle" | "saving" | "saved" | "error";
interface SavingIndicatorProps { status: SavingStatus; className?: string; }

export function SavingIndicator({ status, className }: SavingIndicatorProps) {
  if (status === "idle") return null;
  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      {status === "saving" && <><Loader2 className="h-4 w-4 animate-spin" /><span className="text-muted-foreground">Salvando...</span></>}
      {status === "saved" && <><Check className="h-4 w-4 text-green-500" /><span className="text-green-600">Salvo</span></>}
      {status === "error" && <><X className="h-4 w-4 text-red-500" /><span className="text-red-600">Erro ao salvar</span></>}
    </div>
  );
}
export default SavingIndicator;
