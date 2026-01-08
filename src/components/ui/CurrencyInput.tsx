import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value?: number;
  onChange?: (value: number) => void;
  currency?: string;
  locale?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
}

export function CurrencyInput({ value = 0, onChange, currency = "BRL", locale = "pt-BR", className, placeholder = "0,00", disabled = false, min, max }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(num);
  };

  const parseCurrency = (str: string): number => {
    const digits = str.replace(/\D/g, "");
    return parseInt(digits || "0", 10) / 100;
  };

  useEffect(() => {
    setDisplayValue(formatCurrency(value));
  }, [value, currency, locale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseCurrency(e.target.value);
    let newValue = parsed;
    if (min !== undefined) newValue = Math.max(min, newValue);
    if (max !== undefined) newValue = Math.min(max, newValue);
    onChange?.(newValue);
    setDisplayValue(formatCurrency(newValue));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <Input value={displayValue} onChange={handleChange} onFocus={handleFocus} placeholder={placeholder} disabled={disabled} className={cn("text-right", className)} />
  );
}
export default CurrencyInput;
