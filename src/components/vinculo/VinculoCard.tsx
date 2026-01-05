import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, Edit, Trash2 } from "lucide-react";
export function VinculoCard({ vinculo, onEdit, onDelete }: any) {
  return (
    <Card className="hover:shadow-lg transition-shadow"><CardHeader className="pb-2"><div className="flex justify-between"><CardTitle className="text-lg flex items-center gap-2"><Link className="w-5 h-5" />{vinculo.matricula}</CardTitle><Badge variant={vinculo.ativo ? "default" : "secondary"}>{vinculo.ativo ? "Ativo" : "Inativo"}</Badge></div></CardHeader><CardContent className="space-y-2"><div className="grid grid-cols-2 gap-2 text-sm"><span className="text-muted-foreground">Tipo:</span><span>{vinculo.tipoVinculo}</span><span className="text-muted-foreground">Admissão:</span><span>{vinculo.dataAdmissao}</span><span className="text-muted-foreground">Salário:</span><span>R$ {vinculo.salarioBase?.toFixed(2)}</span></div><div className="flex gap-2 pt-2">{onEdit && <Button variant="outline" size="sm" onClick={onEdit}><Edit className="w-4 h-4 mr-1" />Editar</Button>}{onDelete && <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600"><Trash2 className="w-4 h-4 mr-1" />Excluir</Button>}</div></CardContent></Card>
  );
}
export default VinculoCard;
