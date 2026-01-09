import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PercentageInputProps { label?: string; value?: number; onChange?: (value: number) => void; min?: number; max?: number; decimals?: number; required?: boolean; error?: string; disabled?: boolean; className?: string; }

export function PercentageInput({ label, value = 0, onChange, min = 0, max = 100, decimals = 2, required, error, disabled, className }: PercentageInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let num = parseFloat(e.target.value) || 0;
    if (num < min) num = min;
    if (num > max) num = max;
    onChange?.(num);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>}
      <div className="relative">
        <Input type="number" value={value.toFixed(decimals)} onChange={handleChange} min={min} max={max} step={Math.pow(10, -decimals)} disabled={disabled} className={cn("pr-8", error && "border-destructive")} />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
export default PercentageInput;
