import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RadioGroup as RadioGroupPrimitive, RadioGroupItem } from "@/components/ui/radio-group";

interface RadioOption { value: string; label: string; description?: string; disabled?: boolean; }
interface RadioGroupProps { options: RadioOption[]; value?: string; onChange?: (value: string) => void; orientation?: "horizontal" | "vertical"; className?: string; }

export function RadioGroupField({ options, value, onChange, orientation = "vertical", className }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive value={value} onValueChange={onChange} className={cn(orientation === "horizontal" ? "flex gap-4" : "space-y-2", className)}>
      {options.map((opt) => (
        <div key={opt.value} className="flex items-start space-x-2">
          <RadioGroupItem value={opt.value} id={opt.value} disabled={opt.disabled} />
          <div className="grid gap-0.5">
            <Label htmlFor={opt.value} className={cn(opt.disabled && "text-muted-foreground")}>{opt.label}</Label>
            {opt.description && <p className="text-xs text-muted-foreground">{opt.description}</p>}
          </div>
        </div>
      ))}
    </RadioGroupPrimitive>
  );
}
export default RadioGroupField;
