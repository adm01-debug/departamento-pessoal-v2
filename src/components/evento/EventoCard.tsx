import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
const TIPO_COLORS: Record<string, string> = { PROVENTO: "bg-green-100 text-green-800", DESCONTO: "bg-red-100 text-red-800", INFORMATIVO: "bg-blue-100 text-blue-800" };
export function EventoCard({ evento }: any) {
  return (
    <Card className="hover:shadow-md transition-shadow"><CardHeader className="pb-2"><div className="flex justify-between items-start"><CardTitle className="text-sm flex items-center gap-2"><DollarSign className="w-4 h-4" />{evento.rubricaNome}</CardTitle><Badge className={TIPO_COLORS[evento.tipo]}>{evento.tipo}</Badge></div></CardHeader><CardContent><div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">{evento.origem}</span><span className={`text-lg font-bold ${evento.tipo === "DESCONTO" ? "text-red-600" : "text-green-600"}`}>R$ {evento.valor.toFixed(2)}</span></div></CardContent></Card>
  );
}
export default EventoCard;
