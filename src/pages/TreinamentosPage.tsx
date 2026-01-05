import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, Clock, Plus, CheckCircle } from "lucide-react";
export function TreinamentosPage() {
  const treinamentos = [{ id: "1", nome: "NR-35 Trabalho em Altura", tipo: "Obrigatório", cargaHoraria: 8, participantes: 15, status: "AGENDADO", data: "15/01/2025" }, { id: "2", nome: "Integração Novos", tipo: "Obrigatório", cargaHoraria: 4, participantes: 5, status: "EM_ANDAMENTO", data: "05/01/2025" }];
  return (<div className="space-y-6"><PageHeader title="Treinamentos" description="Gestão de treinamentos e capacitações"><Button><Plus className="h-4 w-4 mr-2" />Novo Treinamento</Button></PageHeader><div className="grid grid-cols-1 md:grid-cols-4 gap-4"><StatCard title="Total" value={treinamentos.length} icon={GraduationCap} /><StatCard title="Participantes" value={treinamentos.reduce((a, t) => a + t.participantes, 0)} icon={Users} /><StatCard title="Horas" value={treinamentos.reduce((a, t) => a + t.cargaHoraria, 0)} icon={Clock} /></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{treinamentos.map(t => <Card key={t.id}><CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-base">{t.nome}</CardTitle><Badge variant={t.status === "CONCLUIDO" ? "default" : "secondary"}>{t.status}</Badge></div></CardHeader><CardContent><div className="space-y-2 text-sm"><p><span className="text-muted-foreground">Tipo:</span> {t.tipo}</p><p><span className="text-muted-foreground">Carga:</span> {t.cargaHoraria}h</p><p><span className="text-muted-foreground">Participantes:</span> {t.participantes}</p><p><span className="text-muted-foreground">Data:</span> {t.data}</p></div></CardContent></Card>)}</div></div>);
}
export default TreinamentosPage;
