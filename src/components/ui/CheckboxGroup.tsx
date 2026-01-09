import React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxOption { value: string; label: string; description?: string; disabled?: boolean; }
interface CheckboxGroupProps { options: CheckboxOption[]; value: string[]; onChange: (value: string[]) => void; orientation?: "horizontal" | "vertical"; className?: string; }

export function CheckboxGroup({ options, value, onChange, orientation = "vertical", className }: CheckboxGroupProps) {
  const toggle = (optValue: string) => {
    const next = value.includes(optValue) ? value.filter((v) => v !== optValue) : [...value, optValue];
    onChange(next);
  };

  return (
    <div className={cn(orientation === "horizontal" ? "flex gap-4" : "space-y-2", className)}>
      {options.map((opt) => (
        <div key={opt.value} className="flex items-start space-x-2">
          <Checkbox id={opt.value} checked={value.includes(opt.value)} onCheckedChange={() => toggle(opt.value)} disabled={opt.disabled} />
          <div className="grid gap-0.5">
            <Label htmlFor={opt.value} className={cn(opt.disabled && "text-muted-foreground")}>{opt.label}</Label>
            {opt.description && <p className="text-xs text-muted-foreground">{opt.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
export default CheckboxGroup;
