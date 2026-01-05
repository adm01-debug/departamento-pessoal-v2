import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
export function DocumentoCard({ documento, onDownload }: any) {
  const vencido = documento.dataValidade && new Date(documento.dataValidade) < new Date();
  return (
    <Card className={vencido ? "border-red-500" : ""}><CardHeader className="pb-2"><div className="flex justify-between"><CardTitle className="text-sm flex items-center gap-2"><FileText className="w-4 h-4" />{documento.nome}</CardTitle><Badge variant="outline">{documento.tipo}</Badge></div></CardHeader><CardContent className="space-y-2"><div className="flex justify-between items-center text-sm">{documento.numero && <span>Nº: {documento.numero}</span>}{documento.dataValidade && <span className={`flex items-center gap-1 ${vencido ? "text-red-600 font-bold" : ""}`}><Calendar className="w-4 h-4" />{documento.dataValidade}</span>}</div>{documento.arquivoUrl && <Button variant="outline" size="sm" className="w-full" onClick={onDownload}><Download className="w-4 h-4 mr-2" />Download</Button>}</CardContent></Card>
  );
}
export default DocumentoCard;
