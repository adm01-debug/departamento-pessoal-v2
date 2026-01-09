import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface NumberFieldProps { label?: string; value?: number; onChange?: (value: number) => void; min?: number; max?: number; step?: number; showControls?: boolean; required?: boolean; error?: string; disabled?: boolean; className?: string; }

export function NumberField({ label, value = 0, onChange, min, max, step = 1, showControls = false, required, error, disabled, className }: NumberFieldProps) {
  const increment = () => { const next = value + step; if (max === undefined || next <= max) onChange?.(next); };
  const decrement = () => { const next = value - step; if (min === undefined || next >= min) onChange?.(next); };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>}
      <div className="flex">
        {showControls && <Button type="button" variant="outline" size="icon" className="rounded-r-none" onClick={decrement} disabled={disabled || (min !== undefined && value <= min)}><Minus className="h-4 w-4" /></Button>}
        <Input type="number" value={value} onChange={(e) => onChange?.(Number(e.target.value))} min={min} max={max} step={step} disabled={disabled} className={cn(showControls && "rounded-none text-center", error && "border-destructive")} />
        {showControls && <Button type="button" variant="outline" size="icon" className="rounded-l-none" onClick={increment} disabled={disabled || (max !== undefined && value >= max)}><Plus className="h-4 w-4" /></Button>}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
export default NumberField;
