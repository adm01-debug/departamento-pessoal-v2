import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users2, Phone, Mail } from "lucide-react";
export function SindicatoCard({ sindicato, onEdit }: any) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onEdit}><CardHeader className="pb-2"><div className="flex justify-between"><CardTitle className="text-lg flex items-center gap-2"><Users2 className="w-5 h-5" />{sindicato.nome}</CardTitle><Badge variant={sindicato.ativo ? "default" : "secondary"}>{sindicato.ativo ? "Ativo" : "Inativo"}</Badge></div><p className="text-sm text-muted-foreground">{sindicato.codigo}</p></CardHeader><CardContent className="space-y-2">{sindicato.telefone && <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4" />{sindicato.telefone}</div>}{sindicato.email && <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4" />{sindicato.email}</div>}</CardContent></Card>
  );
}
export default SindicatoCard;
