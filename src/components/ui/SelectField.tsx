import React from "react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SelectOption { value: string; label: string; disabled?: boolean; }
interface SelectFieldProps { label?: string; options: SelectOption[]; value?: string; onChange: (value: string) => void; placeholder?: string; required?: boolean; error?: string; disabled?: boolean; className?: string; }

export function SelectField({ label, options, value, onChange, placeholder = "Selecione...", required, error, disabled, className }: SelectFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={cn(error && "border-destructive")}><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          {options.map((opt) => <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</SelectItem>)}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
export default SelectField;
