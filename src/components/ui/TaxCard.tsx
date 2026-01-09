import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaxCardProps { name: string; competence: string; dueDate: string; value: number; status: "pago" | "pendente" | "atrasado"; onDownload?: () => void; className?: string; }

export function TaxCard({ name, competence, dueDate, value, status, onDownload, className }: TaxCardProps) {
  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  const statusConfig = { pago: { color: "bg-green-500", label: "Pago" }, pendente: { color: "bg-yellow-500", label: "Pendente" }, atrasado: { color: "bg-red-500", label: "Atrasado" } };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2"><Receipt className="h-5 w-5 text-muted-foreground" /><CardTitle className="text-base">{name}</CardTitle></div>
        <Badge className={statusConfig[status].color}>{statusConfig[status].label}</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground">Competência</p><p className="font-medium">{competence}</p></div>
          <div><p className="text-muted-foreground">Vencimento</p><p className="font-medium flex items-center gap-1"><Calendar className="h-3 w-3" />{dueDate}</p></div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div><p className="text-sm text-muted-foreground">Valor</p><p className="text-xl font-bold">{formatCurrency(value)}</p></div>
          {onDownload && <Button variant="outline" size="sm" onClick={onDownload}><Download className="h-4 w-4 mr-1" />Guia</Button>}
        </div>
      </CardContent>
    </Card>
  );
}
export default TaxCard;
