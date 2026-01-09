import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PayrollItem { label: string; value: number; type: "provento" | "desconto" | "total"; }
interface PayrollSummaryProps { items: PayrollItem[]; grossTotal: number; deductions: number; netTotal: number; className?: string; }

export function PayrollSummary({ items, grossTotal, deductions, netTotal, className }: PayrollSummaryProps) {
  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  const proventos = items.filter((i) => i.type === "provento");
  const descontos = items.filter((i) => i.type === "desconto");

  return (
    <Card className={className}>
      <CardHeader className="pb-2"><CardTitle className="text-base">Resumo da Folha</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-green-600 mb-2">Proventos</p>
          {proventos.map((item, i) => <div key={i} className="flex justify-between text-sm py-1"><span className="text-muted-foreground">{item.label}</span><span>{formatCurrency(item.value)}</span></div>)}
        </div>
        <Separator />
        <div>
          <p className="text-sm font-medium text-red-600 mb-2">Descontos</p>
          {descontos.map((item, i) => <div key={i} className="flex justify-between text-sm py-1"><span className="text-muted-foreground">{item.label}</span><span className="text-red-600">-{formatCurrency(item.value)}</span></div>)}
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span>Total Bruto</span><span className="font-medium">{formatCurrency(grossTotal)}</span></div>
          <div className="flex justify-between text-sm"><span>Total Descontos</span><span className="font-medium text-red-600">-{formatCurrency(deductions)}</span></div>
          <div className="flex justify-between text-lg font-bold"><span>Líquido</span><span className="text-green-600">{formatCurrency(netTotal)}</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
export default PayrollSummary;
