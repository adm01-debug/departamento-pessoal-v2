import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CNPJInputProps { label?: string; value?: string; onChange?: (value: string) => void; required?: boolean; error?: string; disabled?: boolean; className?: string; }

export function CNPJInput({ label = "CNPJ", value = "", onChange, required, error, disabled, className }: CNPJInputProps) {
  const formatCNPJ = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 14);
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5").replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, "$1.$2.$3/$4").replace(/(\d{2})(\d{3})(\d{1,3})/, "$1.$2.$3").replace(/(\d{2})(\d{1,3})/, "$1.$2");
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>}
      <Input value={formatCNPJ(value)} onChange={(e) => onChange?.(e.target.value.replace(/\D/g, ""))} placeholder="00.000.000/0000-00" maxLength={18} disabled={disabled} className={cn(error && "border-destructive")} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
export default CNPJInput;
