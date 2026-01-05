import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Trash2 } from "lucide-react";
export function DocumentoList({ documentos = [], onView, onDownload, onDelete }: any) {
  if (!documentos.length) return <div className="text-center py-8 text-muted-foreground">Nenhum documento cadastrado</div>;
  return (
    <Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Tipo</TableHead><TableHead>Número</TableHead><TableHead>Validade</TableHead><TableHead></TableHead></TableRow></TableHeader>
    <TableBody>{documentos.map((d: any) => { const vencido = d.dataValidade && new Date(d.dataValidade) < new Date(); return <TableRow key={d.id} className={vencido ? "bg-red-50" : ""}><TableCell className="font-medium">{d.nome}</TableCell><TableCell><Badge variant="outline">{d.tipo}</Badge></TableCell><TableCell>{d.numero || "-"}</TableCell><TableCell className={vencido ? "text-red-600 font-bold" : ""}>{d.dataValidade || "-"}</TableCell><TableCell className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => onView?.(d.id)}><Eye className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => onDownload?.(d.id)}><Download className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => onDelete?.(d.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button></TableCell></TableRow>; })}</TableBody></Table>
  );
}
export default DocumentoList;
