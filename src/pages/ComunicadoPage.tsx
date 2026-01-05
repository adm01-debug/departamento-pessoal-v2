import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Megaphone, AlertCircle } from "lucide-react";
export function ComunicadoPage() {
  const [search, setSearch] = useState("");
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-3xl font-bold">Comunicados</h1><p className="text-muted-foreground">Comunicação interna com colaboradores</p></div><Button><Plus className="w-4 h-4 mr-2" />Novo Comunicado</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Megaphone className="w-4 h-4" />Ativos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">0</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-500" />Urgentes</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">0</p></CardContent></Card></div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" /><Input placeholder="Buscar comunicados..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
    </div>
  );
}
export default ComunicadoPage;
