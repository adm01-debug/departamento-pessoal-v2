import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { FolhaEventosTable } from "@/components/tables/FolhaEventosTable";
import { useFolhaCompetencia, useEventosFolha } from "@/queries/folhaQueries";
import { formatters } from "@/utils/formatters";
import { Calculator, Download, Lock, Unlock } from "lucide-react";
export function FolhaDetalhePage() {
  const { competencia } = useParams<{ competencia: string }>();
  const { data: folha, isLoading } = useFolhaCompetencia(competencia!);
  const { data: eventos } = useEventosFolha(folha?.id || "");
  if (isLoading) return <div>Carregando...</div>;
  if (!folha) return <div>Folha não encontrada</div>;
  return (<div className="space-y-6"><PageHeader title={`Folha de Pagamento - ${competencia}`} description={`${folha.colaboradoresCount} colaboradores`}><Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button>{folha.status === "ABERTA" ? <Button><Lock className="h-4 w-4 mr-2" />Fechar</Button> : <Button variant="outline"><Unlock className="h-4 w-4 mr-2" />Reabrir</Button>}</PageHeader><div className="grid grid-cols-4 gap-4"><StatCard title="Proventos" value={formatters.moeda(folha.totalProventos)} /><StatCard title="Descontos" value={formatters.moeda(folha.totalDescontos)} /><StatCard title="Líquido" value={formatters.moeda(folha.totalLiquido)} /><StatCard title="Status" value={folha.status} /></div><Card><CardHeader><CardTitle>Eventos</CardTitle></CardHeader><CardContent>{eventos && <FolhaEventosTable data={eventos.map(e => ({ ...e, colaborador: e.colaboradorId, rubrica: e.rubricaId }))} />}</CardContent></Card></div>);
}
export default FolhaDetalhePage;
