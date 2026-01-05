import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { EmprestimoCard } from "@/components/emprestimo/EmprestimoCard";
import { DollarSign, Users, AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
export function EmprestimosPage() {
  const emprestimos = [{ id: "1", tipo: "Consignado", valorTotal: 10000, valorParcela: 500, parcelasPagas: 8, parcelasTotal: 24, dataInicio: "01/03/2024", situacao: "ATIVO" }, { id: "2", tipo: "Adiantamento", valorTotal: 2000, valorParcela: 500, parcelasPagas: 4, parcelasTotal: 4, dataInicio: "01/10/2024", situacao: "QUITADO" }];
  return (<div className="space-y-6"><PageHeader title="Empréstimos" description="Gestão de empréstimos consignados"><Button><Plus className="h-4 w-4 mr-2" />Novo Empréstimo</Button></PageHeader><div className="grid grid-cols-1 md:grid-cols-4 gap-4"><StatCard title="Ativos" value={emprestimos.filter(e => e.situacao === "ATIVO").length} icon={DollarSign} /><StatCard title="Colaboradores" value="25" icon={Users} /><StatCard title="Total Mensal" value="R$ 15k" icon={DollarSign} /></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{emprestimos.map(emp => <EmprestimoCard key={emp.id} emprestimo={emp} />)}</div></div>);
}
export default EmprestimosPage;
