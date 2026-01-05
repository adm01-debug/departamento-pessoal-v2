import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Cake, Calendar } from "lucide-react";
interface Aniversariante { nome: string; data: string; departamento: string; avatar?: string; }
interface AniversariantesCardProps { aniversariantes: Aniversariante[]; mes: string; }
export function AniversariantesCard({ aniversariantes, mes }: AniversariantesCardProps) {
  return (
    <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Cake className="h-5 w-5 text-pink-500" />Aniversariantes de {mes}</CardTitle></CardHeader><CardContent className="space-y-3">{aniversariantes.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">Nenhum aniversariante este mês</p> : aniversariantes.map((pessoa, i) => <div key={i} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg"><UserAvatar name={pessoa.nome} image={pessoa.avatar} size="sm" showName subtitle={pessoa.departamento} /><div className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-4 w-4" /><span>{pessoa.data}</span></div></div>)}</CardContent></Card>
  );
}
export default AniversariantesCard;
