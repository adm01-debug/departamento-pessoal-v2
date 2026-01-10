import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FormFooterProps { onCancel?: () => void; onSubmit?: () => void; submitLabel?: string; cancelLabel?: string; loading?: boolean; className?: string; }

export function FormFooter({ onCancel, onSubmit, submitLabel = "Salvar", cancelLabel = "Cancelar", loading, className }: FormFooterProps) {
  return (
    <div className={cn("flex justify-end gap-2 pt-4 border-t", className)}>
      {onCancel && <Button variant="outline" onClick={onCancel}>{cancelLabel}</Button>}
      {onSubmit && <Button onClick={onSubmit} disabled={loading}>{loading ? "Salvando..." : submitLabel}</Button>}
    </div>
  );
}
export default FormFooter;
