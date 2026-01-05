import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> { value?: number; onChange?: (value: number) => void; currency?: string; }
export function MoneyInput({ value = 0, onChange, currency = "R$", className, ...props }: MoneyInputProps) {
  const formatDisplay = (val: number) => val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const raw = e.target.value.replace(/\D/g, ""); const numValue = parseInt(raw || "0") / 100; onChange?.(numValue); };
  return (
    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currency}</span><Input {...props} className={cn("pl-10 text-right", className)} value={formatDisplay(value)} onChange={handleChange} inputMode="numeric" /></div>
  );
}
export default MoneyInput;
