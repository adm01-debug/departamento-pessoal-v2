import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Calendar, User } from "lucide-react";
const RESULTADO_COLORS: Record<string, string> = { APTO: "bg-green-100 text-green-800", INAPTO: "bg-red-100 text-red-800", APTO_COM_RESTRICAO: "bg-yellow-100 text-yellow-800" };
export function ExameCard({ exame }: any) {
  const vencido = new Date(exame.dataValidade) < new Date();
  return (
    <Card className={vencido ? "border-red-500" : ""}><CardHeader className="pb-2"><div className="flex justify-between"><CardTitle className="text-sm flex items-center gap-2"><Stethoscope className="w-4 h-4" />{exame.tipo}</CardTitle>{exame.resultado && <Badge className={RESULTADO_COLORS[exame.resultado]}>{exame.resultado}</Badge>}</div></CardHeader><CardContent className="space-y-1 text-sm"><div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>Exame: {exame.dataExame}</span></div><div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span className={vencido ? "text-red-600 font-bold" : ""}>Validade: {exame.dataValidade}</span></div><div className="flex items-center gap-2"><User className="w-4 h-4" /><span>Dr. {exame.medico} - CRM {exame.crm}</span></div></CardContent></Card>
  );
}
export default ExameCard;
