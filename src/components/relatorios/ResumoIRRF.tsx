import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
interface ResumoIRRFProps { competencia: string; empresa: { razaoSocial: string; cnpj: string }; retencoes: { colaborador: string; cpf: string; baseCalculo: number; valorIRRF: number }[]; totalRetido: number; }
export function ResumoIRRF({ competencia, empresa, retencoes, totalRetido }: ResumoIRRFProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Resumo de Retenções IRRF</CardTitle><p className="text-sm text-muted-foreground">{empresa.razaoSocial} - {empresa.cnpj}</p><p className="text-sm">Competência: {competencia}</p></CardHeader>
      <CardContent>
        <Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>CPF</TableHead><TableHead className="text-right">Base Cálculo</TableHead><TableHead className="text-right">IRRF</TableHead></TableRow></TableHeader>
        <TableBody>{retencoes.map((r, i) => <TableRow key={i}><TableCell>{r.colaborador}</TableCell><TableCell>{r.cpf}</TableCell><TableCell className="text-right">R$ {r.baseCalculo.toFixed(2)}</TableCell><TableCell className="text-right">R$ {r.valorIRRF.toFixed(2)}</TableCell></TableRow>)}</TableBody></Table>
        <div className="mt-4 p-4 bg-muted rounded text-right"><span>TOTAL IRRF RETIDO:</span><p className="text-2xl font-bold">R$ {totalRetido.toFixed(2)}</p></div>
      </CardContent>
    </Card>
  );
}
export default ResumoIRRF;
