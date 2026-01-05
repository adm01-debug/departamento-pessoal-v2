import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Activity, Stethoscope, AlertTriangle, Plus, Calendar } from "lucide-react";
export function ASOsPage() {
  const asos = [{ id: "1", colaborador: "João Silva", tipo: "Periódico", data: "05/01/2025", validade: "05/01/2026", resultado: "APTO", clinica: "Clínica MedTrab" }, { id: "2", colaborador: "Maria Santos", tipo: "Periódico", data: "01/12/2024", validade: "01/12/2025", resultado: "APTO", clinica: "Clínica MedTrab" }];
  const vencendo = asos.filter(a => new Date(a.validade.split("/").reverse().join("-")) < new Date(Date.now() + 30 * 86400000));
  return (<div className="space-y-6"><PageHeader title="ASOs" description="Atestados de Saúde Ocupacional"><Button><Plus className="h-4 w-4 mr-2" />Novo ASO</Button></PageHeader><div className="grid grid-cols-1 md:grid-cols-4 gap-4"><StatCard title="Total" value={asos.length} icon={Stethoscope} /><StatCard title="Vencendo" value={vencendo.length} icon={AlertTriangle} description="Próximos 30 dias" /></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{asos.map(aso => <Card key={aso.id}><CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-base">{aso.colaborador}</CardTitle><Badge variant={aso.resultado === "APTO" ? "default" : "destructive"}>{aso.resultado}</Badge></div></CardHeader><CardContent><div className="space-y-2 text-sm"><p><span className="text-muted-foreground">Tipo:</span> {aso.tipo}</p><p><span className="text-muted-foreground">Data:</span> {aso.data}</p><p><span className="text-muted-foreground">Validade:</span> {aso.validade}</p><p><span className="text-muted-foreground">Clínica:</span> {aso.clinica}</p></div></CardContent></Card>)}</div></div>);
}
export default ASOsPage;
