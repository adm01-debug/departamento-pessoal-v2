import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface CurrencyFieldProps { value: number; onChange: (value: number) => void; currency?: string; className?: string; }

export function CurrencyField({ value, onChange, currency = "R$", className }: CurrencyFieldProps) {
  const format = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  const parse = (s: string) => parseFloat(s.replace(/\D/g, "")) / 100 || 0;
  return (
    <div className={cn("relative", className)}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currency}</span>
      <Input value={format(value)} onChange={(e) => onChange(parse(e.target.value))} className="pl-10 text-right" />
    </div>
  );
}
export default CurrencyField;
