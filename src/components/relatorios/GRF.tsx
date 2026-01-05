import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface GRFProps { competencia: string; empresa: { razaoSocial: string; cnpj: string }; valor: number; codigoBarras: string; vencimento: string; }
export function GRF({ competencia, empresa, valor, codigoBarras, vencimento }: GRFProps) {
  return (
    <Card>
      <CardHeader><CardTitle>GRF - Guia de Recolhimento do FGTS</CardTitle><p className="text-sm text-muted-foreground">{empresa.razaoSocial}</p></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4"><div><span className="text-sm text-muted-foreground">CNPJ</span><p className="font-medium">{empresa.cnpj}</p></div><div><span className="text-sm text-muted-foreground">Competência</span><p className="font-medium">{competencia}</p></div></div>
        <div className="p-4 bg-muted rounded"><span className="text-sm">Valor a Recolher</span><p className="text-3xl font-bold">R$ {valor.toFixed(2)}</p><p className="text-sm mt-2">Vencimento: {vencimento}</p></div>
        <div className="p-2 bg-black text-white font-mono text-xs text-center">{codigoBarras}</div>
      </CardContent>
    </Card>
  );
}
export default GRF;
