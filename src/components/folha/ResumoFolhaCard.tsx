import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatters } from "@/utils/formatters";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
interface ResumoFolhaCardProps { resumo: { competencia: string; totalProventos: number; totalDescontos: number; totalLiquido: number; colaboradores: number; status: string }; mesAnterior?: { totalLiquido: number }; }
export function ResumoFolhaCard({ resumo, mesAnterior }: ResumoFolhaCardProps) {
  const variacao = mesAnterior ? ((resumo.totalLiquido - mesAnterior.totalLiquido) / mesAnterior.totalLiquido) * 100 : 0;
  return (<Card><CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-5 w-5" />Folha {resumo.competencia}</CardTitle><Badge variant={resumo.status === "FECHADA" ? "default" : "secondary"}>{resumo.status}</Badge></div></CardHeader><CardContent><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div><p className="text-xs text-muted-foreground">Proventos</p><p className="font-medium text-green-600">{formatters.moeda(resumo.totalProventos)}</p></div><div><p className="text-xs text-muted-foreground">Descontos</p><p className="font-medium text-red-600">{formatters.moeda(resumo.totalDescontos)}</p></div><div><p className="text-xs text-muted-foreground">Líquido</p><p className="font-bold">{formatters.moeda(resumo.totalLiquido)}</p></div></div><div className="flex items-center justify-between pt-2 border-t"><span className="text-sm text-muted-foreground">{resumo.colaboradores} colaboradores</span>{mesAnterior && <span className={`text-sm flex items-center ${variacao >= 0 ? "text-red-600" : "text-green-600"}`}>{variacao >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}{variacao.toFixed(1)}%</span>}</div></div></CardContent></Card>);
}
export default ResumoFolhaCard;
