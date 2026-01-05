import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Edit, Trash2 } from "lucide-react";
const SIT_COLORS: Record<string, string> = { ATIVO: "bg-blue-100 text-blue-800", QUITADO: "bg-green-100 text-green-800", CANCELADO: "bg-red-100 text-red-800", SUSPENSO: "bg-yellow-100 text-yellow-800" };
export function EmprestimoCard({ emprestimo, onEdit, onDelete }: any) {
  const progresso = (emprestimo.parcelasPagas / emprestimo.quantidadeParcelas) * 100;
  const saldoDevedor = emprestimo.valorTotal - (emprestimo.parcelasPagas * emprestimo.valorParcela);
  return (
    <Card className="hover:shadow-lg transition-shadow"><CardHeader className="pb-2"><div className="flex justify-between"><CardTitle className="text-lg flex items-center gap-2"><CreditCard className="w-5 h-5" />{emprestimo.tipo}</CardTitle><Badge className={SIT_COLORS[emprestimo.situacao]}>{emprestimo.situacao}</Badge></div>{emprestimo.contrato && <p className="text-sm text-muted-foreground">Contrato: {emprestimo.contrato}</p>}</CardHeader><CardContent className="space-y-3"><div className="grid grid-cols-2 gap-2 text-sm"><span className="text-muted-foreground">Valor Total:</span><span className="font-medium">R$ {emprestimo.valorTotal?.toFixed(2)}</span><span className="text-muted-foreground">Parcela:</span><span>R$ {emprestimo.valorParcela?.toFixed(2)}</span><span className="text-muted-foreground">Saldo Devedor:</span><span className="font-medium text-red-600">R$ {saldoDevedor.toFixed(2)}</span></div><div><div className="flex justify-between text-sm mb-1"><span>Progresso</span><span>{emprestimo.parcelasPagas}/{emprestimo.quantidadeParcelas}</span></div><Progress value={progresso} /></div><div className="flex gap-2 pt-2">{onEdit && <Button variant="outline" size="sm" onClick={onEdit}><Edit className="w-4 h-4 mr-1" />Editar</Button>}{onDelete && <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600"><Trash2 className="w-4 h-4 mr-1" />Excluir</Button>}</div></CardContent></Card>
  );
}
export default EmprestimoCard;
