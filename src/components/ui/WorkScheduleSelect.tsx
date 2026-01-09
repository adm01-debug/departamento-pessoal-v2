import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";

interface WorkScheduleSelectProps { value?: string; onChange: (value: string) => void; label?: string; disabled?: boolean; className?: string; }

const schedules = [
  { value: "44h", label: "44h semanais (8h + 4h sábado)" },
  { value: "40h", label: "40h semanais (8h seg-sex)" },
  { value: "36h", label: "36h semanais (6h seg-sab)" },
  { value: "30h", label: "30h semanais (6h seg-sex)" },
  { value: "20h", label: "20h semanais (4h seg-sex)" },
  { value: "12x36", label: "12x36 horas" },
  { value: "escala", label: "Escala especial" },
];

export function WorkScheduleSelect({ value, onChange, label = "Jornada de Trabalho", disabled, className }: WorkScheduleSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Selecione" /></div>
        </SelectTrigger>
        <SelectContent>{schedules.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}
export default WorkScheduleSelect;
