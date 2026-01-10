import React from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface DualSliderProps { value: [number, number]; onChange: (value: [number, number]) => void; min?: number; max?: number; step?: number; showValues?: boolean; className?: string; }

export function DualSlider({ value, onChange, min = 0, max = 100, step = 1, showValues = true, className }: DualSliderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Slider value={value} onValueChange={(v) => onChange(v as [number, number])} min={min} max={max} step={step} />
      {showValues && <div className="flex justify-between text-sm text-muted-foreground"><span>{value[0]}</span><span>{value[1]}</span></div>}
    </div>
  );
}
export default DualSlider;
