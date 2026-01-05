import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Building2, FileCheck } from "lucide-react";
const TIPO_COLORS: Record<string, string> = { INDETERMINADO: "bg-green-100 text-green-800", DETERMINADO: "bg-blue-100 text-blue-800", EXPERIENCIA: "bg-yellow-100 text-yellow-800" };
export function ContratoCard({ contrato }: any) {
  return (
    <Card className={contrato.ativo ? "" : "opacity-60"}><CardHeader className="pb-2"><div className="flex justify-between"><CardTitle className="text-sm flex items-center gap-2"><FileText className="w-4 h-4" />{contrato.numero || "Sem número"}</CardTitle><Badge className={TIPO_COLORS[contrato.tipo] || "bg-gray-100"}>{contrato.tipo}</Badge></div></CardHeader><CardContent className="space-y-2"><div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4" /><span>Início: {contrato.dataInicio}</span></div><div className="flex items-center gap-2 text-sm"><Building2 className="w-4 h-4" /><span>{contrato.regimeTrabalho}</span></div><div className="flex items-center gap-2">{contrato.assinado ? <Badge className="bg-green-100 text-green-800"><FileCheck className="w-3 h-3 mr-1" />Assinado</Badge> : <Badge variant="outline">Pendente</Badge>}</div></CardContent></Card>
  );
}
export default ContratoCard;
