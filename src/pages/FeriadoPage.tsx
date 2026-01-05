import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Calendar } from "lucide-react";
const TIPO_COLORS: Record<string, string> = { NACIONAL: "bg-green-100 text-green-800", ESTADUAL: "bg-blue-100 text-blue-800", MUNICIPAL: "bg-purple-100 text-purple-800", PONTO_FACULTATIVO: "bg-yellow-100 text-yellow-800" };
export function FeriadoPage() {
  const [search, setSearch] = useState("");
  const [feriados] = useState<any[]>([]);
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-3xl font-bold">Feriados</h1><p className="text-muted-foreground">Calendário de feriados e pontos facultativos</p></div><Button><Plus className="w-4 h-4 mr-2" />Novo Feriado</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Calendar className="w-4 h-4" />Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{feriados.length}</p></CardContent></Card></div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" /><Input placeholder="Buscar feriados..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
      <Table><TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Descrição</TableHead><TableHead>Tipo</TableHead><TableHead>UF</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
      <TableBody>{feriados.map((f: any) => <TableRow key={f.id}><TableCell>{f.data}</TableCell><TableCell>{f.descricao}</TableCell><TableCell><Badge className={TIPO_COLORS[f.tipo]}>{f.tipo}</Badge></TableCell><TableCell>{f.uf || "Nacional"}</TableCell><TableCell><Badge variant={f.ativo ? "default" : "secondary"}>{f.ativo ? "Ativo" : "Inativo"}</Badge></TableCell></TableRow>)}</TableBody></Table>
    </div>
  );
}
export default FeriadoPage;
