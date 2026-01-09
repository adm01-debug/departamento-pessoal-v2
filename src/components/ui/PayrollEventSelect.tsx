import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from "lucide-react";

interface PayrollEventSelectProps { value?: string; onChange: (value: string) => void; type?: "provento" | "desconto" | "all"; label?: string; disabled?: boolean; className?: string; }

const events = [
  { value: "salario", label: "Salário", type: "provento" },
  { value: "hora_extra", label: "Hora Extra", type: "provento" },
  { value: "adicional_noturno", label: "Adicional Noturno", type: "provento" },
  { value: "comissao", label: "Comissão", type: "provento" },
  { value: "bonus", label: "Bônus", type: "provento" },
  { value: "vale_transporte", label: "Vale Transporte", type: "desconto" },
  { value: "vale_refeicao", label: "Vale Refeição", type: "desconto" },
  { value: "inss", label: "INSS", type: "desconto" },
  { value: "irrf", label: "IRRF", type: "desconto" },
  { value: "fgts", label: "FGTS", type: "desconto" },
  { value: "pensao", label: "Pensão Alimentícia", type: "desconto" },
];

export function PayrollEventSelect({ value, onChange, type = "all", label = "Evento", disabled, className }: PayrollEventSelectProps) {
  const filtered = type === "all" ? events : events.filter((e) => e.type === type);
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger><div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Selecione" /></div></SelectTrigger>
        <SelectContent>{filtered.map((e) => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}
export default PayrollEventSelect;
