import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Percent, DollarSign } from "lucide-react";
export function PensaoCard({ pensao }: any) {
  return (
    <Card className="hover:shadow-lg transition-shadow"><CardHeader className="pb-2"><div className="flex justify-between"><CardTitle className="text-lg flex items-center gap-2"><Scale className="w-5 h-5" />{pensao.beneficiario}</CardTitle><Badge variant={pensao.ativo ? "default" : "secondary"}>{pensao.ativo ? "Ativa" : "Inativa"}</Badge></div></CardHeader><CardContent className="space-y-2"><div className="flex items-center gap-2">{pensao.tipoCalculo === "PERCENTUAL" ? <><Percent className="w-4 h-4" /><span>{pensao.percentual}% sobre {pensao.baseCalculo}</span></> : <><DollarSign className="w-4 h-4" /><span>R$ {pensao.valorFixo?.toFixed(2)}</span></>}</div>{pensao.numeroProcesso && <p className="text-sm text-muted-foreground">Processo: {pensao.numeroProcesso}</p>}</CardContent></Card>
  );
}
export default PensaoCard;
