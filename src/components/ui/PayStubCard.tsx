import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, Printer } from "lucide-react";

interface PayStubCardProps { month: string; year: number; grossSalary: number; netSalary: number; status?: "processado" | "pendente" | "erro"; onView?: () => void; onDownload?: () => void; onPrint?: () => void; className?: string; }

export function PayStubCard({ month, year, grossSalary, netSalary, status = "processado", onView, onDownload, onPrint, className }: PayStubCardProps) {
  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  const statusColors = { processado: "bg-green-500", pendente: "bg-yellow-500", erro: "bg-red-500" };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">{month} {year}</CardTitle>
        <Badge className={statusColors[status]}>{status}</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><p className="text-sm text-muted-foreground">Bruto</p><p className="font-semibold">{formatCurrency(grossSalary)}</p></div>
          <div><p className="text-sm text-muted-foreground">Líquido</p><p className="font-semibold text-green-600">{formatCurrency(netSalary)}</p></div>
        </div>
        <div className="flex gap-2">
          {onView && <Button variant="outline" size="sm" onClick={onView}><Eye className="h-4 w-4 mr-1" />Ver</Button>}
          {onDownload && <Button variant="outline" size="sm" onClick={onDownload}><Download className="h-4 w-4 mr-1" />PDF</Button>}
          {onPrint && <Button variant="outline" size="sm" onClick={onPrint}><Printer className="h-4 w-4 mr-1" />Imprimir</Button>}
        </div>
      </CardContent>
    </Card>
  );
}
export default PayStubCard;
