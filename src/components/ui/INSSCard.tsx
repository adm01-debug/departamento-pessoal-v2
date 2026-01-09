import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

interface INSSCardProps { baseValue: number; aliquot: number; discount: number; className?: string; }

export function INSSCard({ baseValue, aliquot, discount, className }: INSSCardProps) {
  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Shield className="h-5 w-5 text-blue-500" />
        <CardTitle className="text-base">INSS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Base de Cálculo</span><span className="font-medium">{formatCurrency(baseValue)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Alíquota</span><span className="font-medium">{aliquot.toFixed(2)}%</span></div>
        <div className="flex justify-between text-sm pt-2 border-t"><span className="font-medium">Desconto</span><span className="font-bold text-red-600">{formatCurrency(discount)}</span></div>
      </CardContent>
    </Card>
  );
}
export default INSSCard;
