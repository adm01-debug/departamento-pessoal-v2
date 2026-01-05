import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, UserPlus, UserMinus, Clock, FileText, Award } from "lucide-react";
interface DashboardRHProps { totalColaboradores: number; admissoesPendentes: number; demissoesPendentes: number; feriasAgendadas: number; atestadosMes: number; treinamentosPendentes: number; avaliacoesPendentes: number; documentosVencendo: number; aniversariantes: number; }
export function DashboardRH(props: DashboardRHProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard RH</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Users className="w-4 h-4" />Colaboradores</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{props.totalColaboradores}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><UserPlus className="w-4 h-4 text-green-500" />Admissões Pendentes</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-green-600">{props.admissoesPendentes}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><UserMinus className="w-4 h-4 text-red-500" />Demissões Pendentes</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-red-600">{props.demissoesPendentes}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Clock className="w-4 h-4" />Férias Agendadas</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{props.feriasAgendadas}</p></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Atestados no Mês</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{props.atestadosMes}</p><Progress value={(props.atestadosMes / props.totalColaboradores) * 100} className="mt-2" /></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Award className="w-4 h-4" />Treinamentos Pendentes</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{props.treinamentosPendentes}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FileText className="w-4 h-4" />Documentos Vencendo</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-yellow-600">{props.documentosVencendo}</p></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="text-sm">🎂 Aniversariantes do Mês: {props.aniversariantes}</CardTitle></CardHeader></Card>
    </div>
  );
}
export default DashboardRH;
