import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap } from "lucide-react";

interface EducationLevelSelectProps { value?: string; onChange: (value: string) => void; label?: string; disabled?: boolean; className?: string; }

const levels = [{ value: "fundamental_inc", label: "Fundamental Incompleto" }, { value: "fundamental", label: "Fundamental Completo" }, { value: "medio_inc", label: "Médio Incompleto" }, { value: "medio", label: "Médio Completo" }, { value: "superior_inc", label: "Superior Incompleto" }, { value: "superior", label: "Superior Completo" }, { value: "pos", label: "Pós-Graduação" }, { value: "mestrado", label: "Mestrado" }, { value: "doutorado", label: "Doutorado" }];

export function EducationLevelSelect({ value, onChange, label = "Escolaridade", disabled, className }: EducationLevelSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger><div className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Selecione" /></div></SelectTrigger>
        <SelectContent>{levels.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}
export default EducationLevelSelect;
