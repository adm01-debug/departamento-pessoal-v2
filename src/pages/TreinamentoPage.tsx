import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, GraduationCap, Clock } from "lucide-react";
export function TreinamentoPage() {
  const [search, setSearch] = useState("");
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-3xl font-bold">Treinamentos</h1><p className="text-muted-foreground">Gestão de capacitação e desenvolvimento</p></div><Button><Plus className="w-4 h-4 mr-2" />Novo Treinamento</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><GraduationCap className="w-4 h-4" />Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">0</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Clock className="w-4 h-4" />Horas Totais</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">0h</p></CardContent></Card></div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" /><Input placeholder="Buscar treinamentos..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
    </div>
  );
}
export default TreinamentoPage;
