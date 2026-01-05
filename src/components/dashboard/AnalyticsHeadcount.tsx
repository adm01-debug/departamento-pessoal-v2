import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface AnalyticsHeadcountProps { total: number; porTipoContrato: { tipo: string; quantidade: number }[]; porDepartamento: { nome: string; quantidade: number }[]; porGenero: { masculino: number; feminino: number; outro: number }; porFaixaEtaria: { faixa: string; quantidade: number }[]; evolucao: { mes: string; total: number }[]; }
export function AnalyticsHeadcount({ total, porTipoContrato, porDepartamento, porGenero, porFaixaEtaria }: AnalyticsHeadcountProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics - Headcount</h1>
      <Card><CardHeader className="pb-2"><CardTitle>Total de Colaboradores</CardTitle></CardHeader><CardContent><p className="text-5xl font-bold">{total}</p></CardContent></Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Por Tipo de Contrato</CardTitle></CardHeader><CardContent>{porTipoContrato.map((t, i) => <div key={i} className="flex justify-between py-1 border-b"><span>{t.tipo}</span><span className="font-bold">{t.quantidade}</span></div>)}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Por Gênero</CardTitle></CardHeader><CardContent><div className="space-y-2"><div className="flex justify-between"><span>Masculino</span><span>{porGenero.masculino}</span></div><div className="flex justify-between"><span>Feminino</span><span>{porGenero.feminino}</span></div></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Por Faixa Etária</CardTitle></CardHeader><CardContent>{porFaixaEtaria.map((f, i) => <div key={i} className="flex justify-between py-1"><span>{f.faixa}</span><span>{f.quantidade}</span></div>)}</CardContent></Card>
      </div>
    </div>
  );
}
export default AnalyticsHeadcount;
