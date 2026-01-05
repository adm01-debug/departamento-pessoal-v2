import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
interface Atividade { tipo: string; descricao: string; usuario: string; data: string; hora: string; }
interface AtividadesRecentesProps { atividades: Atividade[]; onVerTodas?: () => void; }
export function AtividadesRecentes({ atividades, onVerTodas }: AtividadesRecentesProps) {
  return (
    <Card><CardHeader className="pb-2"><div className="flex justify-between items-center"><CardTitle className="text-base">Atividades Recentes</CardTitle>{onVerTodas && <Button variant="link" size="sm" onClick={onVerTodas}>Ver todas <ArrowRight className="h-4 w-4 ml-1" /></Button>}</div></CardHeader><CardContent className="space-y-3">{atividades.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">Nenhuma atividade recente</p> : atividades.map((atv, i) => <div key={i} className="flex items-start gap-3"><div className="mt-1"><div className="h-2 w-2 rounded-full bg-primary" /></div><div className="flex-1"><p className="text-sm">{atv.descricao}</p><p className="text-xs text-muted-foreground">{atv.usuario} • {atv.data} às {atv.hora}</p></div></div>)}</CardContent></Card>
  );
}
export default AtividadesRecentes;
