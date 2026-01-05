import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Calendar } from "lucide-react";
const PRIORIDADE_COLORS: Record<string, string> = { BAIXA: "bg-gray-100 text-gray-800", MEDIA: "bg-blue-100 text-blue-800", ALTA: "bg-yellow-100 text-yellow-800", URGENTE: "bg-red-100 text-red-800" };
export function ComunicadoCard({ comunicado, onClick }: any) {
  return (
    <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${comunicado.prioridade === "URGENTE" ? "border-red-500" : ""}`} onClick={onClick}><CardHeader className="pb-2"><div className="flex justify-between"><CardTitle className="text-lg flex items-center gap-2"><Megaphone className="w-5 h-5" />{comunicado.titulo}</CardTitle><Badge className={PRIORIDADE_COLORS[comunicado.prioridade]}>{comunicado.prioridade}</Badge></div></CardHeader><CardContent><p className="text-sm text-muted-foreground line-clamp-2">{comunicado.conteudo}</p><div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground"><Calendar className="w-3 h-3" />{comunicado.dataPublicacao}</div></CardContent></Card>
  );
}
export default ComunicadoCard;
