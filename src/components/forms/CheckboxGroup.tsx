import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
interface CheckboxGroupProps { options: { value: string; label: string; description?: string }[]; value?: string[]; onChange?: (value: string[]) => void; className?: string; }
export function CheckboxGroup({ options, value = [], onChange, className }: CheckboxGroupProps) {
  const handleChange = (optValue: string, checked: boolean) => { if (checked) { onChange?.([...value, optValue]); } else { onChange?.(value.filter(v => v !== optValue)); } };
  return (
    <div className={cn("space-y-3", className)}>{options.map(opt => <div key={opt.value} className="flex items-start gap-3"><Checkbox id={opt.value} checked={value.includes(opt.value)} onCheckedChange={checked => handleChange(opt.value, !!checked)} /><div><Label htmlFor={opt.value} className="cursor-pointer">{opt.label}</Label>{opt.description && <p className="text-xs text-muted-foreground">{opt.description}</p>}</div></div>)}</div>
  );
}
export default CheckboxGroup;
