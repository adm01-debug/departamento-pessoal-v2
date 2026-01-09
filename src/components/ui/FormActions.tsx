import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps { onCancel?: () => void; cancelLabel?: string; submitLabel?: string; isLoading?: boolean; disabled?: boolean; align?: "left" | "right" | "center" | "between"; className?: string; }

export function FormActions({ onCancel, cancelLabel = "Cancelar", submitLabel = "Salvar", isLoading, disabled, align = "right", className }: FormActionsProps) {
  const aligns = { left: "justify-start", right: "justify-end", center: "justify-center", between: "justify-between" };
  return (
    <div className={cn("flex gap-2 pt-4", aligns[align], className)}>
      {onCancel && <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>{cancelLabel}</Button>}
      <Button type="submit" disabled={disabled || isLoading}>{isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{submitLabel}</Button>
    </div>
  );
}
export default FormActions;
