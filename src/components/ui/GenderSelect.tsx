import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GenderSelectProps { value?: string; onChange: (value: string) => void; label?: string; disabled?: boolean; className?: string; }

export function GenderSelect({ value, onChange, label = "Sexo", disabled, className }: GenderSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="M">Masculino</SelectItem>
          <SelectItem value="F">Feminino</SelectItem>
          <SelectItem value="O">Outro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
export default GenderSelect;
