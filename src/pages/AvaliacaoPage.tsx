import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, ClipboardCheck, Clock, CheckCircle } from "lucide-react";
export function AvaliacaoPage() {
  const [search, setSearch] = useState("");
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-3xl font-bold">Avaliações de Desempenho</h1><p className="text-muted-foreground">Ciclos de avaliação e feedback</p></div><Button><Plus className="w-4 h-4 mr-2" />Nova Avaliação</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ClipboardCheck className="w-4 h-4" />Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">0</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-yellow-500" />Pendentes</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-yellow-600">0</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Concluídas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">0</p></CardContent></Card></div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" /><Input placeholder="Buscar avaliações..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
    </div>
  );
}
export default AvaliacaoPage;
