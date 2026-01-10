import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SuccessPageProps { title?: string; message?: string; actionLabel?: string; onAction?: () => void; className?: string; }

export function SuccessPage({ title = "Sucesso!", message = "Operação realizada.", actionLabel, onAction, className }: SuccessPageProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] text-center p-4", className)}>
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-6">{message}</p>
      {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}
export default SuccessPage;
