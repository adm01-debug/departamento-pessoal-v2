import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
interface ResumoFGTSProps { competencia: string; empresa: { razaoSocial: string; cnpj: string }; depositos: { colaborador: string; pis: string; remuneracao: number; fgts: number }[]; totalDepositos: number; }
export function ResumoFGTS({ competencia, empresa, depositos, totalDepositos }: ResumoFGTSProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Resumo de Depósitos FGTS</CardTitle><p className="text-sm text-muted-foreground">{empresa.razaoSocial} - {empresa.cnpj}</p><p className="text-sm">Competência: {competencia} | Alíquota: 8%</p></CardHeader>
      <CardContent>
        <Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>PIS/NIT</TableHead><TableHead className="text-right">Remuneração</TableHead><TableHead className="text-right">FGTS (8%)</TableHead></TableRow></TableHeader>
        <TableBody>{depositos.map((d, i) => <TableRow key={i}><TableCell>{d.colaborador}</TableCell><TableCell>{d.pis}</TableCell><TableCell className="text-right">R$ {d.remuneracao.toFixed(2)}</TableCell><TableCell className="text-right">R$ {d.fgts.toFixed(2)}</TableCell></TableRow>)}</TableBody></Table>
        <div className="mt-4 p-4 bg-muted rounded text-right"><span>TOTAL FGTS A DEPOSITAR:</span><p className="text-2xl font-bold text-primary">R$ {totalDepositos.toFixed(2)}</p></div>
      </CardContent>
    </Card>
  );
}
export default ResumoFGTS;
