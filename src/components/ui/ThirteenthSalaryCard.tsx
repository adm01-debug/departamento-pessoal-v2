import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ThirteenthSalaryCardProps { year: number; monthsWorked: number; firstInstallment: number; secondInstallment: number; paid1st?: boolean; paid2nd?: boolean; className?: string; }

export function ThirteenthSalaryCard({ year, monthsWorked, firstInstallment, secondInstallment, paid1st = false, paid2nd = false, className }: ThirteenthSalaryCardProps) {
  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  const progress = ((paid1st ? 1 : 0) + (paid2nd ? 1 : 0)) * 50;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Gift className="h-5 w-5 text-primary" />
        <CardTitle className="text-base">13º Salário - {year}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Meses Trabalhados</span><span className="font-medium">{monthsWorked}/12</span></div>
        <Progress value={progress} className="h-2" />
        <div className="grid grid-cols-2 gap-4">
          <div className={cn("p-3 rounded border", paid1st && "bg-green-50 border-green-200")}>
            <p className="text-xs text-muted-foreground">1ª Parcela (Nov)</p>
            <p className="font-bold">{formatCurrency(firstInstallment)}</p>
            <p className="text-xs mt-1">{paid1st ? "✅ Pago" : "⏳ Pendente"}</p>
          </div>
          <div className={cn("p-3 rounded border", paid2nd && "bg-green-50 border-green-200")}>
            <p className="text-xs text-muted-foreground">2ª Parcela (Dez)</p>
            <p className="font-bold">{formatCurrency(secondInstallment)}</p>
            <p className="text-xs mt-1">{paid2nd ? "✅ Pago" : "⏳ Pendente"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default ThirteenthSalaryCard;
