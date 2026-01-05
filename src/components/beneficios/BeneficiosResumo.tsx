import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, Users } from "lucide-react";
interface Beneficio { nome: string; tipo: string; beneficiarios: number; totalBeneficiarios: number; custoMensal: number; }
interface BeneficiosResumoProps { beneficios: Beneficio[]; custoTotal: number; }
export function BeneficiosResumo({ beneficios, custoTotal }: BeneficiosResumoProps) {
  return (
    <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Heart className="h-5 w-5 text-red-500" />Resumo de Benefícios</CardTitle></CardHeader><CardContent className="space-y-4">{beneficios.map((b, i) => <div key={i} className="space-y-2"><div className="flex justify-between items-center"><span className="font-medium">{b.nome}</span><span className="text-sm text-muted-foreground">{b.beneficiarios}/{b.totalBeneficiarios}</span></div><Progress value={(b.beneficiarios / b.totalBeneficiarios) * 100} className="h-2" /><p className="text-xs text-muted-foreground">R$ {b.custoMensal.toLocaleString()}/mês</p></div>)}<div className="pt-4 border-t"><div className="flex justify-between"><span className="font-medium">Custo Total</span><span className="font-bold text-lg">R$ {custoTotal.toLocaleString()}</span></div></div></CardContent></Card>
  );
}
export default BeneficiosResumo;
