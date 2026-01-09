import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CompetenceSelectProps { label?: string; month?: number; year?: number; onMonthChange: (month: number) => void; onYearChange: (year: number) => void; disabled?: boolean; className?: string; }

const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export function CompetenceSelect({ label = "Competência", month, year, onMonthChange, onYearChange, disabled, className }: CompetenceSelectProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="flex gap-2">
        <Select value={String(month)} onValueChange={(v) => onMonthChange(Number(v))} disabled={disabled}>
          <SelectTrigger className="flex-1"><SelectValue placeholder="Mês" /></SelectTrigger>
          <SelectContent>{months.map((m, i) => <SelectItem key={i} value={String(i)}>{m}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={String(year)} onValueChange={(v) => onYearChange(Number(v))} disabled={disabled}>
          <SelectTrigger className="w-24"><SelectValue placeholder="Ano" /></SelectTrigger>
          <SelectContent>{years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>
  );
}
export default CompetenceSelect;
