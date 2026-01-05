import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
const TIPO_COLORS: Record<string, string> = { ADMISSIONAL: "bg-green-100 text-green-800", PERIODICO: "bg-blue-100 text-blue-800", DEMISSIONAL: "bg-red-100 text-red-800" };
const RESULTADO_COLORS: Record<string, string> = { APTO: "bg-green-100 text-green-800", INAPTO: "bg-red-100 text-red-800", APTO_COM_RESTRICAO: "bg-yellow-100 text-yellow-800" };
export function ExameList({ exames = [] }: any) {
  if (!exames.length) return <div className="text-center py-8 text-muted-foreground">Nenhum exame registrado</div>;
  return (
    <Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Tipo</TableHead><TableHead>Data</TableHead><TableHead>Validade</TableHead><TableHead>Resultado</TableHead><TableHead>Médico</TableHead></TableRow></TableHeader>
    <TableBody>{exames.map((e: any) => <TableRow key={e.id}><TableCell>{e.colaboradorNome}</TableCell><TableCell><Badge className={TIPO_COLORS[e.tipo] || ""}>{e.tipo}</Badge></TableCell><TableCell>{e.dataExame}</TableCell><TableCell>{e.dataValidade}</TableCell><TableCell><Badge className={RESULTADO_COLORS[e.resultado] || ""}>{e.resultado || "-"}</Badge></TableCell><TableCell>{e.medico}</TableCell></TableRow>)}</TableBody></Table>
  );
}
export default ExameList;
