import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface PortalGestorProps { gestorId: string; equipe: { id: string; nome: string; cargo: string; status: string }[]; pendencias: { tipo: string; quantidade: number }[]; }
export function PortalGestor({ gestorId, equipe, pendencias }: PortalGestorProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Portal do Gestor</h1>
      <div className="grid grid-cols-3 gap-4">{pendencias.map((p, i) => <Card key={i}><CardHeader className="pb-2"><CardTitle className="text-sm">{p.tipo}</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{p.quantidade}</p></CardContent></Card>)}</div>
      <Card><CardHeader><CardTitle>Minha Equipe ({equipe.length})</CardTitle></CardHeader><CardContent>{equipe.map(e => <div key={e.id} className="flex justify-between py-2 border-b"><span>{e.nome}</span><span className="text-muted-foreground">{e.cargo}</span></div>)}</CardContent></Card>
    </div>
  );
}
export default PortalGestor;
