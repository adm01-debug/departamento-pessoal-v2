import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Clock, Users, DollarSign } from "lucide-react";
const TIPO_COLORS: Record<string, string> = { NR: "bg-red-100 text-red-800", OBRIGATORIO: "bg-yellow-100 text-yellow-800", TECNICO: "bg-blue-100 text-blue-800" };
export function TreinamentoCard({ treinamento, onEdit }: any) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onEdit}><CardHeader className="pb-2"><div className="flex justify-between"><CardTitle className="text-lg flex items-center gap-2"><GraduationCap className="w-5 h-5" />{treinamento.nome}</CardTitle><Badge className={TIPO_COLORS[treinamento.tipo] || ""}>{treinamento.tipo}</Badge></div></CardHeader><CardContent className="space-y-2"><div className="flex items-center gap-4 text-sm"><span className="flex items-center gap-1"><Clock className="w-4 h-4" />{treinamento.cargaHoraria}h</span><span>{treinamento.modalidade}</span></div>{treinamento.instrutor && <p className="text-sm text-muted-foreground">Instrutor: {treinamento.instrutor}</p>}{treinamento.custo && <div className="flex items-center gap-1 text-sm"><DollarSign className="w-4 h-4" />R$ {treinamento.custo.toFixed(2)}</div>}</CardContent></Card>
  );
}
export default TreinamentoCard;
