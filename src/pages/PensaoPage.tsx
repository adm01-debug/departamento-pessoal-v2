import React, { useState } from "react";
import { usePensao } from "@/hooks/usePensao";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Scale } from "lucide-react";
export function PensaoPage() {
  const { pensoes, isLoading } = usePensao();
  const [search, setSearch] = useState("");
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-3xl font-bold">Pensões Alimentícias</h1><p className="text-muted-foreground">Gerencie as pensões judiciais</p></div><Button><Plus className="w-4 h-4 mr-2" />Nova Pensão</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Scale className="w-4 h-4" />Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{pensoes.length}</p></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm">Ativas</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{pensoes.filter((p: any) => p.ativo).length}</p></CardContent></Card></div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" /><Input placeholder="Buscar pensões..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
    </div>
  );
}
export default PensaoPage;
