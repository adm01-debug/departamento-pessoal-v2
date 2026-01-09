import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun } from "lucide-react";

interface VacationPaymentCardProps { days: number; salary: number; vacationPay: number; bonus: number; total: number; avgINSS?: number; avgIRRF?: number; netValue: number; className?: string; }

export function VacationPaymentCard({ days, salary, vacationPay, bonus, total, avgINSS = 0, avgIRRF = 0, netValue, className }: VacationPaymentCardProps) {
  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Sun className="h-5 w-5 text-yellow-500" />
        <CardTitle className="text-base">Cálculo de Férias - {days} dias</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Salário Base</span><span>{formatCurrency(salary)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Valor das Férias</span><span>{formatCurrency(vacationPay)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">1/3 Constitucional</span><span>{formatCurrency(bonus)}</span></div>
        <div className="flex justify-between font-medium border-t pt-2"><span>Bruto</span><span>{formatCurrency(total)}</span></div>
        {avgINSS > 0 && <div className="flex justify-between"><span className="text-muted-foreground">INSS</span><span className="text-red-600">-{formatCurrency(avgINSS)}</span></div>}
        {avgIRRF > 0 && <div className="flex justify-between"><span className="text-muted-foreground">IRRF</span><span className="text-red-600">-{formatCurrency(avgIRRF)}</span></div>}
        <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Líquido</span><span className="text-green-600">{formatCurrency(netValue)}</span></div>
      </CardContent>
    </Card>
  );
}
export default VacationPaymentCard;
