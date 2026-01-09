import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Clock, Briefcase } from "lucide-react";

interface ContractInfoProps { type: string; startDate: string; endDate?: string; workload: string; position: string; department: string; salary: number; status: "ativo" | "encerrado" | "suspenso"; className?: string; }

export function ContractInfo({ type, startDate, endDate, workload, position, department, salary, status, className }: ContractInfoProps) {
  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  const statusColors = { ativo: "bg-green-500", encerrado: "bg-gray-500", suspenso: "bg-yellow-500" };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /><CardTitle className="text-base">Contrato de Trabalho</CardTitle></div>
        <Badge className={statusColors[status]}>{status}</Badge>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm">
        <div><p className="text-muted-foreground">Tipo</p><p className="font-medium">{type}</p></div>
        <div><p className="text-muted-foreground">Jornada</p><p className="font-medium flex items-center gap-1"><Clock className="h-3 w-3" />{workload}</p></div>
        <div><p className="text-muted-foreground">Início</p><p className="font-medium flex items-center gap-1"><Calendar className="h-3 w-3" />{startDate}</p></div>
        {endDate && <div><p className="text-muted-foreground">Término</p><p className="font-medium flex items-center gap-1"><Calendar className="h-3 w-3" />{endDate}</p></div>}
        <div><p className="text-muted-foreground">Cargo</p><p className="font-medium flex items-center gap-1"><Briefcase className="h-3 w-3" />{position}</p></div>
        <div><p className="text-muted-foreground">Departamento</p><p className="font-medium">{department}</p></div>
        <div className="col-span-2 pt-2 border-t"><p className="text-muted-foreground">Salário</p><p className="font-bold text-lg">{formatCurrency(salary)}</p></div>
      </CardContent>
    </Card>
  );
}
export default ContractInfo;
