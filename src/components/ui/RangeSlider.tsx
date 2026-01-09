import React from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface RangeSliderProps { label?: string; value: [number, number]; onChange: (value: [number, number]) => void; min?: number; max?: number; step?: number; formatValue?: (value: number) => string; className?: string; }

export function RangeSlider({ label, value, onChange, min = 0, max = 100, step = 1, formatValue = (v) => String(v), className }: RangeSliderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        {label && <Label>{label}</Label>}
        <span className="text-sm text-muted-foreground">{formatValue(value[0])} - {formatValue(value[1])}</span>
      </div>
      <Slider value={value} onValueChange={(v) => onChange(v as [number, number])} min={min} max={max} step={step} />
    </div>
  );
}
export default RangeSlider;
