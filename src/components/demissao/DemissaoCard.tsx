import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserMinus, Calendar, FileText } from "lucide-react";
const TIPO_COLORS: Record<string, string> = { SEM_JUSTA_CAUSA: "bg-blue-100 text-blue-800", JUSTA_CAUSA: "bg-red-100 text-red-800", PEDIDO: "bg-yellow-100 text-yellow-800", ACORDO: "bg-green-100 text-green-800" };
export function DemissaoCard({ demissao }: any) {
  return (
    <Card className="hover:shadow-lg transition-shadow"><CardHeader className="pb-2"><div className="flex justify-between"><CardTitle className="text-lg flex items-center gap-2"><UserMinus className="w-5 h-5" />{demissao.colaboradorNome}</CardTitle><Badge className={TIPO_COLORS[demissao.tipo]}>{demissao.tipo}</Badge></div></CardHeader><CardContent className="space-y-2"><div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4" /><span>{demissao.data}</span></div>{demissao.motivo && <div className="flex items-center gap-2 text-sm"><FileText className="w-4 h-4" /><span className="truncate">{demissao.motivo}</span></div>}</CardContent></Card>
  );
}
export default DemissaoCard;
