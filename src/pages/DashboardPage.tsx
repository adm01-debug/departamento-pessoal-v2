import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Calendar, Clock, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { PageHeader } from "@/components/ui/page-header";
export function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-6"><PageHeader title="Dashboard" description="Visão geral do departamento pessoal" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><StatCard title="Total Colaboradores" value="150" icon={Users} trend={{ value: 5, positive: true }} /><StatCard title="Custo Folha" value="R$ 1,5M" icon={DollarSign} trend={{ value: 3, positive: false }} /><StatCard title="Férias Pendentes" value="12" icon={Calendar} description="Próximos 30 dias" /><StatCard title="Horas Extras" value="450h" icon={Clock} description="Este mês" /></div><div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><Card><CardHeader><CardTitle>Alertas</CardTitle></CardHeader><CardContent className="space-y-3"><div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg"><AlertTriangle className="h-5 w-5 text-yellow-600" /><div><p className="font-medium">5 ASOs vencendo</p><p className="text-sm text-muted-foreground">Próximos 30 dias</p></div></div><div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"><CheckCircle className="h-5 w-5 text-green-600" /><div><p className="font-medium">Folha calculada</p><p className="text-sm text-muted-foreground">Competência 01/2025</p></div></div></CardContent></Card><Card><CardHeader><CardTitle>Atividades Recentes</CardTitle></CardHeader><CardContent className="space-y-3"><div className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-green-500" /><p className="text-sm">Admissão de João Silva processada</p></div><div className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-blue-500" /><p className="text-sm">Férias de Maria Santos aprovadas</p></div><div className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-yellow-500" /><p className="text-sm">Ponto importado - 150 registros</p></div></CardContent></Card></div></div>
  );
}
export default DashboardPage;
