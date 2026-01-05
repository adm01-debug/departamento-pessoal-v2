import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Check, Filter } from "lucide-react";
import { NotificacaoList } from "@/components/notificacao/NotificacaoList";
export function NotificacaoPage() {
  const [filtro, setFiltro] = useState<"TODAS" | "NAO_LIDAS">("TODAS");
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-3xl font-bold">Notificações</h1><p className="text-muted-foreground">Central de notificações e alertas</p></div><Button variant="outline"><Check className="w-4 h-4 mr-2" />Marcar todas como lidas</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Bell className="w-4 h-4" />Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">0</p></CardContent></Card></div>
      <div className="flex gap-2"><Button variant={filtro === "TODAS" ? "default" : "outline"} onClick={() => setFiltro("TODAS")}>Todas</Button><Button variant={filtro === "NAO_LIDAS" ? "default" : "outline"} onClick={() => setFiltro("NAO_LIDAS")}>Não lidas</Button></div>
      <NotificacaoList notificacoes={[]} />
    </div>
  );
}
export default NotificacaoPage;
