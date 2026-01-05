import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Activity, FileWarning } from "lucide-react";
interface DashboardSSTProps { acidentes: number; incidentes: number; diasSemAcidente: number; examesVencidos: number; asosVencendo: number; treinamentosNR: number; }
export function DashboardSST({ acidentes, incidentes, diasSemAcidente, examesVencidos, asosVencendo, treinamentosNR }: DashboardSSTProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2"><Shield className="w-8 h-8" />Dashboard SST</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50"><CardHeader className="pb-2"><CardTitle className="text-sm">Dias sem Acidentes</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold text-green-600">{diasSemAcidente}</p></CardContent></Card>
        <Card className={acidentes > 0 ? "bg-red-50" : ""}><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4" />Acidentes (ano)</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-red-600">{acidentes}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Activity className="w-4 h-4" />Incidentes</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-yellow-600">{incidentes}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FileWarning className="w-4 h-4" />ASOs Vencendo</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{asosVencendo}</p></CardContent></Card>
      </div>
    </div>
  );
}
export default DashboardSST;
