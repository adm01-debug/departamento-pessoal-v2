import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface SalaryItem { label: string; value: number; type: "earning" | "deduction"; }
interface SalaryBreakdownProps { items: SalaryItem[]; className?: string; }

export function SalaryBreakdown({ items, className }: SalaryBreakdownProps) {
  const earnings = items.filter((i) => i.type === "earning");
  const deductions = items.filter((i) => i.type === "deduction");
  const totalEarnings = earnings.reduce((sum, i) => sum + i.value, 0);
  const totalDeductions = deductions.reduce((sum, i) => sum + i.value, 0);
  const netSalary = totalEarnings - totalDeductions;
  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <Card className={className}>
      <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-4 w-4" />Composição Salarial</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-green-600 mb-2">Proventos</p>
          {earnings.map((item, i) => <div key={i} className="flex justify-between text-sm py-1"><span className="text-muted-foreground">{item.label}</span><span>{formatCurrency(item.value)}</span></div>)}
          <div className="flex justify-between text-sm py-1 font-medium border-t mt-2"><span>Total Proventos</span><span className="text-green-600">{formatCurrency(totalEarnings)}</span></div>
        </div>
        <div>
          <p className="text-sm font-medium text-red-600 mb-2">Descontos</p>
          {deductions.map((item, i) => <div key={i} className="flex justify-between text-sm py-1"><span className="text-muted-foreground">{item.label}</span><span className="text-red-600">-{formatCurrency(item.value)}</span></div>)}
          <div className="flex justify-between text-sm py-1 font-medium border-t mt-2"><span>Total Descontos</span><span className="text-red-600">-{formatCurrency(totalDeductions)}</span></div>
        </div>
        <div className="bg-primary/5 p-3 rounded-lg flex justify-between items-center">
          <span className="font-medium">Salário Líquido</span>
          <span className="text-xl font-bold text-primary">{formatCurrency(netSalary)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
export default SalaryBreakdown;
