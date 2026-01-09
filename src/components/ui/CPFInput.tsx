import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CPFInputProps { label?: string; value?: string; onChange?: (value: string) => void; required?: boolean; error?: string; disabled?: boolean; className?: string; }

export function CPFInput({ label = "CPF", value = "", onChange, required, error, disabled, className }: CPFInputProps) {
  const formatCPF = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3").replace(/(\d{3})(\d{1,3})/, "$1.$2");
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>}
      <Input value={formatCPF(value)} onChange={(e) => onChange?.(e.target.value.replace(/\D/g, ""))} placeholder="000.000.000-00" maxLength={14} disabled={disabled} className={cn(error && "border-destructive")} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
export default CPFInput;
