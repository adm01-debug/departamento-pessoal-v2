import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Calendar, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
const STATUS_COLORS: Record<string, string> = { PENDENTE: "bg-gray-100 text-gray-800", CONCLUIDA: "bg-green-100 text-green-800" };
export function AvaliacaoCard({ avaliacao, onClick }: any) {
  const progresso = { PENDENTE: 0, AUTOAVALIACAO: 25, AVALIACAO_GESTOR: 50, FEEDBACK: 75, CONCLUIDA: 100 }[avaliacao.status] || 0;
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}><CardHeader className="pb-2"><div className="flex justify-between"><CardTitle className="text-sm flex items-center gap-2"><ClipboardCheck className="w-4 h-4" />{avaliacao.colaboradorNome}</CardTitle><Badge className={STATUS_COLORS[avaliacao.status] || ""}>{avaliacao.status}</Badge></div></CardHeader><CardContent className="space-y-3"><div className="flex justify-between text-sm"><span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{avaliacao.periodo}</span><span>{avaliacao.tipo}</span></div><Progress value={progresso} className="h-2" />{avaliacao.notaFinal && <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /><span className="font-bold">{avaliacao.notaFinal.toFixed(1)}</span></div>}</CardContent></Card>
  );
}
export default AvaliacaoCard;
