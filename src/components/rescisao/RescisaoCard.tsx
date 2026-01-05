import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar } from "lucide-react";
export function RescisaoCard({ rescisao }: any) {
  return (
    <Card className="hover:shadow-lg transition-shadow"><CardHeader className="pb-2"><div className="flex justify-between"><CardTitle className="text-lg flex items-center gap-2"><DollarSign className="w-5 h-5" />{rescisao.colaboradorNome}</CardTitle><Badge variant={rescisao.pago ? "default" : "secondary"}>{rescisao.pago ? "Pago" : "Pendente"}</Badge></div></CardHeader><CardContent className="space-y-2"><div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4" /><span>Cálculo: {rescisao.dataCalculo}</span></div><div className="grid grid-cols-2 gap-2 text-sm mt-2"><div><span className="text-muted-foreground">Proventos:</span><span className="font-medium text-green-600 ml-1">R$ {rescisao.totalProventos?.toFixed(2)}</span></div><div><span className="text-muted-foreground">Líquido:</span><span className="font-bold ml-1">R$ {rescisao.liquido?.toFixed(2)}</span></div></div></CardContent></Card>
  );
}
export default RescisaoCard;
