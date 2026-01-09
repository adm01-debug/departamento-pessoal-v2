import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SalaryInputProps { label?: string; value?: number; onChange?: (value: number) => void; currency?: string; required?: boolean; error?: string; disabled?: boolean; className?: string; }

export function SalaryInput({ label = "Salário", value = 0, onChange, currency = "R$", required, error, disabled, className }: SalaryInputProps) {
  const formatCurrency = (val: number) => val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const parseCurrency = (str: string) => parseFloat(str.replace(/\./g, "").replace(",", ".")) || 0;

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currency}</span>
        <Input value={formatCurrency(value)} onChange={(e) => onChange?.(parseCurrency(e.target.value))} className={cn("pl-10", error && "border-destructive")} disabled={disabled} />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
export default SalaryInput;
