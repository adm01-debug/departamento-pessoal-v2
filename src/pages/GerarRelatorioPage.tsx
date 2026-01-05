import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Calendar } from "lucide-react";
export function GerarRelatorioPage() {
  const relatorios = [{ id: "folha-analitica", nome: "Folha Analítica", desc: "Detalhamento completo por colaborador" }, { id: "folha-sintetica", nome: "Folha Sintética", desc: "Resumo por departamento" }, { id: "resumo-inss", nome: "Resumo INSS", desc: "Valores de INSS por faixa" }, { id: "resumo-irrf", nome: "Resumo IRRF", desc: "Valores de IRRF por faixa" }, { id: "resumo-fgts", nome: "Resumo FGTS", desc: "Valores de FGTS" }, { id: "grf", nome: "GRF", desc: "Guia de Recolhimento do FGTS" }];
  return (<div className="space-y-6"><PageHeader title="Gerar Relatório" description="Selecione o relatório e os parâmetros" /><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><Card className="md:col-span-2"><CardHeader><CardTitle>Parâmetros</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>Competência</Label><Input type="month" defaultValue="2025-01" /></div><div><Label>Formato</Label><Select defaultValue="pdf"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pdf">PDF</SelectItem><SelectItem value="excel">Excel</SelectItem><SelectItem value="csv">CSV</SelectItem></SelectContent></Select></div></div><div><Label>Departamento</Label><Select><SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger><SelectContent><SelectItem value="todos">Todos</SelectItem><SelectItem value="ti">TI</SelectItem><SelectItem value="rh">RH</SelectItem></SelectContent></Select></div><Button className="w-full"><Download className="h-4 w-4 mr-2" />Gerar Relatório</Button></CardContent></Card><div className="space-y-4">{relatorios.map(r => <Card key={r.id} className="cursor-pointer hover:border-primary"><CardContent className="pt-4"><div className="flex items-start gap-3"><FileText className="h-5 w-5 text-primary" /><div><p className="font-medium">{r.nome}</p><p className="text-sm text-muted-foreground">{r.desc}</p></div></div></CardContent></Card>)}</div></div></div>);
}
export default GerarRelatorioPage;
