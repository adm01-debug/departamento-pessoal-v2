import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserMinus } from "lucide-react";

interface TerminationTypeSelectProps { value?: string; onChange: (value: string) => void; label?: string; disabled?: boolean; className?: string; }

const types = [{ value: "pedido_demissao", label: "Pedido de Demissão" }, { value: "dispensa_sem_justa_causa", label: "Dispensa sem Justa Causa" }, { value: "dispensa_justa_causa", label: "Dispensa por Justa Causa" }, { value: "termino_contrato", label: "Término de Contrato" }, { value: "acordo_mutuo", label: "Acordo Mútuo" }, { value: "aposentadoria", label: "Aposentadoria" }, { value: "falecimento", label: "Falecimento" }];

export function TerminationTypeSelect({ value, onChange, label = "Tipo de Desligamento", disabled, className }: TerminationTypeSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger><div className="flex items-center gap-2"><UserMinus className="h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Selecione" /></div></SelectTrigger>
        <SelectContent>{types.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}
export default TerminationTypeSelect;
