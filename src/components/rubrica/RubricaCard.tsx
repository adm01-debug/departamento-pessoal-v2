import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Edit, Trash2 } from "lucide-react";
const TIPO_COLORS: Record<string, string> = { PROVENTO: "bg-green-100 text-green-800", DESCONTO: "bg-red-100 text-red-800", INFORMATIVA: "bg-blue-100 text-blue-800" };
export function RubricaCard({ rubrica, onEdit, onDelete }: any) {
  return (
    <Card className="hover:shadow-lg transition-shadow"><CardHeader className="pb-2"><div className="flex justify-between"><CardTitle className="text-lg flex items-center gap-2"><DollarSign className="w-5 h-5" />{rubrica.descricao}</CardTitle><Badge className={TIPO_COLORS[rubrica.tipo]}>{rubrica.tipo}</Badge></div><p className="text-sm text-muted-foreground">Código: {rubrica.codigo}</p></CardHeader><CardContent className="space-y-3"><div className="text-sm"><span className="text-muted-foreground">Natureza:</span> {rubrica.natureza}</div><div className="flex flex-wrap gap-1">{rubrica.incideINSS && <Badge variant="outline" className="text-xs">INSS</Badge>}{rubrica.incideIRRF && <Badge variant="outline" className="text-xs">IRRF</Badge>}{rubrica.incideFGTS && <Badge variant="outline" className="text-xs">FGTS</Badge>}{rubrica.incideFerias && <Badge variant="outline" className="text-xs">Férias</Badge>}{rubrica.incide13 && <Badge variant="outline" className="text-xs">13º</Badge>}</div><div className="flex gap-2 pt-2">{onEdit && <Button variant="outline" size="sm" onClick={onEdit}><Edit className="w-4 h-4 mr-1" />Editar</Button>}{onDelete && <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600"><Trash2 className="w-4 h-4 mr-1" />Excluir</Button>}</div></CardContent></Card>
  );
}
export default RubricaCard;
