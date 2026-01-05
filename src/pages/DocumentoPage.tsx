import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, FileText, AlertTriangle } from "lucide-react";
export function DocumentoPage() {
  const [search, setSearch] = useState("");
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-3xl font-bold">Documentos</h1><p className="text-muted-foreground">Gestão documental de colaboradores</p></div><Button><Plus className="w-4 h-4 mr-2" />Novo Documento</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FileText className="w-4 h-4" />Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">0</p></CardContent></Card><Card className="border-yellow-500"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500" />Vencendo</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-yellow-600">0</p></CardContent></Card></div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" /><Input placeholder="Buscar documentos..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
    </div>
  );
}
export default DocumentoPage;
