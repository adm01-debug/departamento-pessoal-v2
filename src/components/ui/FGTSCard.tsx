import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface FGTSCardProps { baseValue: number; aliquot: number; deposit: number; balance?: number; className?: string; }

export function FGTSCard({ baseValue, aliquot, deposit, balance, className }: FGTSCardProps) {
  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Wallet className="h-5 w-5 text-orange-500" />
        <CardTitle className="text-base">FGTS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Base de Cálculo</span><span className="font-medium">{formatCurrency(baseValue)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Alíquota</span><span className="font-medium">{aliquot.toFixed(2)}%</span></div>
        <div className="flex justify-between pt-2 border-t"><span className="font-medium">Depósito Mensal</span><span className="font-bold text-green-600">{formatCurrency(deposit)}</span></div>
        {balance !== undefined && <div className="flex justify-between pt-2 border-t"><span className="text-muted-foreground">Saldo Acumulado</span><span className="font-bold">{formatCurrency(balance)}</span></div>}
      </CardContent>
    </Card>
  );
}
export default FGTSCard;
