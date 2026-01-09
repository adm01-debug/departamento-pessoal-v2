import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp } from "lucide-react";

interface OvertimeCardProps { period: string; hours50: number; hours100: number; totalValue?: number; status?: "aprovado" | "pendente" | "rejeitado"; className?: string; }

export function OvertimeCard({ period, hours50, hours100, totalValue, status = "pendente", className }: OvertimeCardProps) {
  const statusConfig = { aprovado: { color: "bg-green-500", label: "Aprovado" }, pendente: { color: "bg-yellow-500", label: "Pendente" }, rejeitado: { color: "bg-red-500", label: "Rejeitado" } };
  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2"><TrendingUp className="h-4 w-4" />Horas Extras</CardTitle>
        <Badge className={statusConfig[status].color}>{statusConfig[status].label}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">{period}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-muted rounded"><p className="text-2xl font-bold">{hours50}h</p><p className="text-xs text-muted-foreground">50%</p></div>
          <div className="text-center p-2 bg-muted rounded"><p className="text-2xl font-bold">{hours100}h</p><p className="text-xs text-muted-foreground">100%</p></div>
        </div>
        {totalValue && <div className="mt-3 pt-3 border-t text-center"><p className="text-sm text-muted-foreground">Valor Total</p><p className="text-lg font-bold text-green-600">{formatCurrency(totalValue)}</p></div>}
      </CardContent>
    </Card>
  );
}
export default OvertimeCard;
