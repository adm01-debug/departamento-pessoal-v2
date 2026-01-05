import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatters } from "@/utils/formatters";
interface Rubrica { id: string; codigo: string; descricao: string; tipo: "PROVENTO" | "DESCONTO" | "INFORMATIVO"; natureza: string; incideINSS: boolean; incideIRRF: boolean; incideFGTS: boolean; ativo: boolean; }
interface RubricasTableProps { data: Rubrica[]; }
export function RubricasTable({ data }: RubricasTableProps) {
  return (<Table><TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Descrição</TableHead><TableHead>Tipo</TableHead><TableHead>Natureza</TableHead><TableHead className="text-center">INSS</TableHead><TableHead className="text-center">IRRF</TableHead><TableHead className="text-center">FGTS</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{data.map(r => <TableRow key={r.id} className={!r.ativo ? "opacity-50" : ""}><TableCell className="font-mono">{r.codigo}</TableCell><TableCell>{r.descricao}</TableCell><TableCell><Badge variant={r.tipo === "PROVENTO" ? "default" : r.tipo === "DESCONTO" ? "destructive" : "secondary"}>{r.tipo}</Badge></TableCell><TableCell>{r.natureza}</TableCell><TableCell className="text-center">{r.incideINSS ? "✓" : "-"}</TableCell><TableCell className="text-center">{r.incideIRRF ? "✓" : "-"}</TableCell><TableCell className="text-center">{r.incideFGTS ? "✓" : "-"}</TableCell><TableCell><Badge variant={r.ativo ? "default" : "secondary"}>{r.ativo ? "Ativo" : "Inativo"}</Badge></TableCell></TableRow>)}</TableBody></Table>);
}
export default RubricasTable;
