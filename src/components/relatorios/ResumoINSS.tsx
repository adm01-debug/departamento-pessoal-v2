import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
interface ResumoINSSProps { competencia: string; empresa: { razaoSocial: string; cnpj: string }; contribuicoes: { descricao: string; baseCalculo: number; aliquota: number; valor: number }[]; totalEmpregados: number; totalPatronal: number; totalTerceiros: number; totalGeral: number; }
export function ResumoINSS({ competencia, empresa, contribuicoes, totalEmpregados, totalPatronal, totalTerceiros, totalGeral }: ResumoINSSProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Resumo de Contribuições INSS</CardTitle><p className="text-sm text-muted-foreground">{empresa.razaoSocial} - CNPJ: {empresa.cnpj}</p><p className="text-sm">Competência: {competencia}</p></CardHeader>
      <CardContent>
        <Table><TableHeader><TableRow><TableHead>Descrição</TableHead><TableHead className="text-right">Base Cálculo</TableHead><TableHead className="text-right">Alíquota</TableHead><TableHead className="text-right">Valor</TableHead></TableRow></TableHeader>
        <TableBody>{contribuicoes.map((c, i) => <TableRow key={i}><TableCell>{c.descricao}</TableCell><TableCell className="text-right">R$ {c.baseCalculo.toFixed(2)}</TableCell><TableCell className="text-right">{c.aliquota.toFixed(2)}%</TableCell><TableCell className="text-right">R$ {c.valor.toFixed(2)}</TableCell></TableRow>)}</TableBody></Table>
        <div className="grid grid-cols-4 gap-4 mt-4 p-4 bg-muted rounded"><div><span className="text-xs">Empregados</span><p className="font-bold">R$ {totalEmpregados.toFixed(2)}</p></div><div><span className="text-xs">Patronal</span><p className="font-bold">R$ {totalPatronal.toFixed(2)}</p></div><div><span className="text-xs">Terceiros</span><p className="font-bold">R$ {totalTerceiros.toFixed(2)}</p></div><div><span className="text-xs">TOTAL</span><p className="text-xl font-bold text-primary">R$ {totalGeral.toFixed(2)}</p></div></div>
      </CardContent>
    </Card>
  );
}
export default ResumoINSS;
