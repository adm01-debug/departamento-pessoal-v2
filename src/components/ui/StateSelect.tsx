import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StateSelectProps { value?: string; onChange: (value: string) => void; label?: string; disabled?: boolean; className?: string; }

const states = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

export function StateSelect({ value, onChange, label = "Estado", disabled, className }: StateSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-24"><SelectValue placeholder="UF" /></SelectTrigger>
        <SelectContent>{states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}
export default StateSelect;
