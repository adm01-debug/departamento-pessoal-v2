import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";

interface ContractTypeSelectProps { value?: string; onChange: (value: string) => void; label?: string; disabled?: boolean; className?: string; }

const contractTypes = [
  { value: "clt", label: "CLT" },
  { value: "pj", label: "PJ" },
  { value: "estagio", label: "Estágio" },
  { value: "temporario", label: "Temporário" },
  { value: "experiencia", label: "Experiência" },
  { value: "jovem_aprendiz", label: "Jovem Aprendiz" },
  { value: "autonomo", label: "Autônomo" },
];

export function ContractTypeSelect({ value, onChange, label = "Tipo de Contrato", disabled, className }: ContractTypeSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Selecione" /></div>
        </SelectTrigger>
        <SelectContent>{contractTypes.map((ct) => <SelectItem key={ct.value} value={ct.value}>{ct.label}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}
export default ContractTypeSelect;
