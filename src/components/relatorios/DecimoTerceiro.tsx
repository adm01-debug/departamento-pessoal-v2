import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
interface DecimoTerceiroProps { parcela: "1" | "2"; ano: number; colaboradores: { nome: string; salarioBase: number; mediaVariaveis: number; avos: number; valor: number; inss?: number; irrf?: number; liquido: number }[]; totalBruto: number; totalLiquido: number; }
export function DecimoTerceiro({ parcela, ano, colaboradores, totalBruto, totalLiquido }: DecimoTerceiroProps) {
  return (
    <Card>
      <CardHeader><CardTitle>13º Salário - {parcela}ª Parcela</CardTitle><p className="text-sm text-muted-foreground">Ano: {ano}</p></CardHeader>
      <CardContent>
        <Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead className="text-right">Base</TableHead><TableHead className="text-right">Avos</TableHead><TableHead className="text-right">Bruto</TableHead>{parcela === "2" && <><TableHead className="text-right">INSS</TableHead><TableHead className="text-right">IRRF</TableHead></>}<TableHead className="text-right">Líquido</TableHead></TableRow></TableHeader>
        <TableBody>{colaboradores.map((c, i) => <TableRow key={i}><TableCell>{c.nome}</TableCell><TableCell className="text-right">R$ {c.salarioBase.toFixed(2)}</TableCell><TableCell className="text-right">{c.avos}/12</TableCell><TableCell className="text-right">R$ {c.valor.toFixed(2)}</TableCell>{parcela === "2" && <><TableCell className="text-right">R$ {c.inss?.toFixed(2)}</TableCell><TableCell className="text-right">R$ {c.irrf?.toFixed(2)}</TableCell></>}<TableCell className="text-right font-bold">R$ {c.liquido.toFixed(2)}</TableCell></TableRow>)}</TableBody></Table>
        <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-muted rounded"><div><span className="text-sm">Total Bruto</span><p className="text-xl font-bold">R$ {totalBruto.toFixed(2)}</p></div><div><span className="text-sm">Total Líquido</span><p className="text-xl font-bold text-primary">R$ {totalLiquido.toFixed(2)}</p></div></div>
      </CardContent>
    </Card>
  );
}
export default DecimoTerceiro;
