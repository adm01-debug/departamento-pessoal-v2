import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface TerminationItem { label: string; value: number; type: "provento" | "desconto"; }
interface TerminationSummaryProps { items: TerminationItem[]; totalProvento: number; totalDesconto: number; netValue: number; className?: string; }

export function TerminationSummary({ items, totalProvento, totalDesconto, netValue, className }: TerminationSummaryProps) {
  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  const proventos = items.filter((i) => i.type === "provento");
  const descontos = items.filter((i) => i.type === "desconto");

  return (
    <Card className={className}>
      <CardHeader className="pb-2"><CardTitle className="text-base">Rescisão Trabalhista</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {proventos.length > 0 && (
          <div>
            <p className="text-sm font-medium text-green-600 mb-2">Proventos</p>
            {proventos.map((item, i) => <div key={i} className="flex justify-between text-sm py-1"><span className="text-muted-foreground">{item.label}</span><span>{formatCurrency(item.value)}</span></div>)}
            <div className="flex justify-between text-sm py-1 font-medium"><span>Subtotal</span><span>{formatCurrency(totalProvento)}</span></div>
          </div>
        )}
        <Separator />
        {descontos.length > 0 && (
          <div>
            <p className="text-sm font-medium text-red-600 mb-2">Descontos</p>
            {descontos.map((item, i) => <div key={i} className="flex justify-between text-sm py-1"><span className="text-muted-foreground">{item.label}</span><span className="text-red-600">-{formatCurrency(item.value)}</span></div>)}
            <div className="flex justify-between text-sm py-1 font-medium"><span>Subtotal</span><span className="text-red-600">-{formatCurrency(totalDesconto)}</span></div>
          </div>
        )}
        <Separator />
        <div className="flex justify-between text-lg font-bold"><span>Valor Líquido</span><span className={netValue >= 0 ? "text-green-600" : "text-red-600"}>{formatCurrency(netValue)}</span></div>
      </CardContent>
    </Card>
  );
}
export default TerminationSummary;
