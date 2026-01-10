import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface QuantityInputProps { value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number; className?: string; }

export function QuantityInput({ value, onChange, min = 0, max = 999, step = 1, className }: QuantityInputProps) {
  const decrease = () => onChange(Math.max(min, value - step));
  const increase = () => onChange(Math.min(max, value + step));

  return (
    <div className={cn("flex items-center", className)}>
      <Button variant="outline" size="icon" onClick={decrease} disabled={value <= min}><Minus className="h-4 w-4" /></Button>
      <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-16 text-center mx-1" min={min} max={max} />
      <Button variant="outline" size="icon" onClick={increase} disabled={value >= max}><Plus className="h-4 w-4" /></Button>
    </div>
  );
}
export default QuantityInput;
