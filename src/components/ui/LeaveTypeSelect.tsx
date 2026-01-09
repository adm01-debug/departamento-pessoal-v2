import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface LeaveTypeSelectProps { value?: string; onChange: (value: string) => void; label?: string; disabled?: boolean; className?: string; }

const leaveTypes = [{ value: "ferias", label: "Férias" }, { value: "licenca_medica", label: "Licença Médica" }, { value: "licenca_maternidade", label: "Licença Maternidade" }, { value: "licenca_paternidade", label: "Licença Paternidade" }, { value: "licenca_casamento", label: "Licença Casamento" }, { value: "licenca_obito", label: "Licença Óbito" }, { value: "falta_justificada", label: "Falta Justificada" }, { value: "falta_injustificada", label: "Falta Injustificada" }, { value: "afastamento_inss", label: "Afastamento INSS" }];

export function LeaveTypeSelect({ value, onChange, label = "Tipo de Afastamento", disabled, className }: LeaveTypeSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger><div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Selecione" /></div></SelectTrigger>
        <SelectContent>{leaveTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}
export default LeaveTypeSelect;
