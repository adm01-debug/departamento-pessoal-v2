import React from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface SliderInputProps { label?: string; value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number; showValue?: boolean; formatValue?: (value: number) => string; className?: string; }

export function SliderInput({ label, value, onChange, min = 0, max = 100, step = 1, showValue = true, formatValue, className }: SliderInputProps) {
  const displayValue = formatValue ? formatValue(value) : value;
  return (
    <div className={cn("space-y-2", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <Label>{label}</Label>}
          {showValue && <span className="text-sm text-muted-foreground">{displayValue}</span>}
        </div>
      )}
      <Slider value={[value]} onValueChange={([v]) => onChange(v)} min={min} max={max} step={step} />
    </div>
  );
}
export default SliderInput;
