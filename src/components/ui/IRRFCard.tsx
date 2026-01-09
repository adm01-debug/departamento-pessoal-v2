import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from "lucide-react";

interface IRRFCardProps { baseValue: number; dependents: number; deduction: number; aliquot: number; discount: number; className?: string; }

export function IRRFCard({ baseValue, dependents, deduction, aliquot, discount, className }: IRRFCardProps) {
  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Receipt className="h-5 w-5 text-green-500" />
        <CardTitle className="text-base">IRRF</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Base de Cálculo</span><span className="font-medium">{formatCurrency(baseValue)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Dependentes</span><span className="font-medium">{dependents}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Dedução por Dependente</span><span className="font-medium">{formatCurrency(deduction)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Alíquota</span><span className="font-medium">{aliquot.toFixed(2)}%</span></div>
        <div className="flex justify-between pt-2 border-t"><span className="font-medium">Desconto</span><span className="font-bold text-red-600">{formatCurrency(discount)}</span></div>
      </CardContent>
    </Card>
  );
}
export default IRRFCard;
