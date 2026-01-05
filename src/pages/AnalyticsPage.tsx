import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { AbsenteismoChart } from "@/components/analytics/AbsenteismoChart";
import { TurnoverChart } from "@/components/analytics/TurnoverChart";
import { HeadcountDepartamento } from "@/components/analytics/HeadcountDepartamento";
import { DistribuicaoSalarial } from "@/components/analytics/DistribuicaoSalarial";
import { TrendingUp, Users, DollarSign, Clock } from "lucide-react";
export function AnalyticsPage() {
  return (<div className="space-y-6"><PageHeader title="Analytics" description="Indicadores e métricas de RH" /><div className="grid grid-cols-1 md:grid-cols-4 gap-4"><StatCard title="Headcount" value="150" icon={Users} trend={{ value: 5, positive: true }} description="vs mês anterior" /><StatCard title="Custo Médio" value="R$ 10k" icon={DollarSign} /><StatCard title="Turnover" value="2.1%" icon={TrendingUp} /><StatCard title="Absenteísmo" value="2.8%" icon={Clock} /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><HeadcountDepartamento data={[{ departamento: "TI", colaboradores: 45, custo: 300000, percentual: 30 }, { departamento: "RH", colaboradores: 15, custo: 90000, percentual: 10 }, { departamento: "Comercial", colaboradores: 60, custo: 400000, percentual: 40 }]} /><DistribuicaoSalarial data={[{ faixa: "Até 3k", quantidade: 30, percentual: 20 }, { faixa: "3k-6k", quantidade: 60, percentual: 40 }, { faixa: "6k-10k", quantidade: 45, percentual: 30 }, { faixa: "Acima 10k", quantidade: 15, percentual: 10 }]} /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><TurnoverChart data={[{ periodo: "Jul/24", admissoes: 5, demissoes: 3, taxa: 2.1 }, { periodo: "Ago/24", admissoes: 4, demissoes: 2, taxa: 1.8 }, { periodo: "Set/24", admissoes: 6, demissoes: 4, taxa: 2.5 }]} /><AbsenteismoChart data={[{ departamento: "TI", diasPerdidos: 15, taxaAbsenteismo: 2.5, principalMotivo: "Atestado médico" }, { departamento: "Comercial", diasPerdidos: 25, taxaAbsenteismo: 3.8, principalMotivo: "Falta injustificada" }]} /></div></div>);
}
export default AnalyticsPage;
