import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, CreditCard, Star, QrCode } from "lucide-react";
export function DadosBancariosCard({ conta }: any) {
  return (
    <Card className={conta.principal ? "border-yellow-300" : ""}><CardHeader className="pb-2"><div className="flex justify-between"><CardTitle className="text-sm flex items-center gap-2"><Building2 className="w-4 h-4" />{conta.banco}</CardTitle>{conta.principal && <Badge className="bg-yellow-100 text-yellow-800"><Star className="w-3 h-3 mr-1" />Principal</Badge>}</div></CardHeader><CardContent className="space-y-2"><div className="flex items-center gap-2 text-sm"><CreditCard className="w-4 h-4" /><span>Ag: {conta.agencia} | Cc: {conta.conta}</span></div><div className="flex items-center gap-2"><Badge variant="outline">{conta.tipoConta}</Badge>{conta.chavePix && <Badge className="bg-green-100 text-green-800"><QrCode className="w-3 h-3 mr-1" />PIX</Badge>}</div></CardContent></Card>
  );
}
export default DadosBancariosCard;
