import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderTree, Edit, Trash2 } from "lucide-react";
export function LotacaoCard({ lotacao, onEdit, onDelete }: any) {
  return (
    <Card className="hover:shadow-lg transition-shadow"><CardHeader className="pb-2"><div className="flex justify-between"><CardTitle className="text-lg flex items-center gap-2"><FolderTree className="w-5 h-5" />{lotacao.descricao}</CardTitle><Badge variant={lotacao.ativo ? "default" : "secondary"}>{lotacao.ativo ? "Ativo" : "Inativo"}</Badge></div><p className="text-sm text-muted-foreground">{lotacao.codigo}</p></CardHeader><CardContent className="space-y-2"><div className="grid grid-cols-2 gap-2 text-sm"><span className="text-muted-foreground">Tipo:</span><span>{lotacao.tipo}</span><span className="text-muted-foreground">Cód. Contábil:</span><span>{lotacao.codigoContabil || "-"}</span></div><div className="flex gap-2 pt-2">{onEdit && <Button variant="outline" size="sm" onClick={onEdit}><Edit className="w-4 h-4 mr-1" />Editar</Button>}{onDelete && <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600"><Trash2 className="w-4 h-4 mr-1" />Excluir</Button>}</div></CardContent></Card>
  );
}
export default LotacaoCard;
