import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Heart } from "lucide-react";
export function DependenteCard({ dependente }: any) {
  return (
    <Card><CardHeader className="pb-2"><div className="flex justify-between"><CardTitle className="text-sm flex items-center gap-2"><User className="w-4 h-4" />{dependente.nome}</CardTitle><Badge variant="outline">{dependente.parentesco}</Badge></div></CardHeader><CardContent className="space-y-2"><div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4" />{dependente.dataNascimento}</div><div className="flex gap-2">{dependente.irrf && <Badge className="bg-green-100 text-green-800">IRRF</Badge>}{dependente.salarioFamilia && <Badge className="bg-blue-100 text-blue-800">Sal.Família</Badge>}{dependente.planoSaude && <Badge className="bg-purple-100 text-purple-800">Plano</Badge>}{dependente.invalidez && <Badge className="bg-red-100 text-red-800"><Heart className="w-3 h-3 mr-1" />Invalidez</Badge>}</div></CardContent></Card>
  );
}
export default DependenteCard;
