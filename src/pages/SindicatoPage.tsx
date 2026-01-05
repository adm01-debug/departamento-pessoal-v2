import React, { useState } from "react";
import { useSindicato } from "@/hooks/useSindicato";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Users2 } from "lucide-react";
export function SindicatoPage() {
  const { sindicatos, isLoading } = useSindicato();
  const [search, setSearch] = useState("");
  const filtered = sindicatos.filter((s: any) => s.nome?.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-3xl font-bold">Sindicatos</h1><p className="text-muted-foreground">Cadastro de sindicatos e entidades</p></div><Button><Plus className="w-4 h-4 mr-2" />Novo Sindicato</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Users2 className="w-4 h-4" />Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{sindicatos.length}</p></CardContent></Card></div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" /><Input placeholder="Buscar sindicatos..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
      {isLoading ? <div>Carregando...</div> : <div className="grid gap-4">{filtered.map((s: any) => <Card key={s.id}><CardContent className="pt-4"><div className="flex justify-between"><div><p className="font-medium">{s.nome}</p><p className="text-sm text-muted-foreground">{s.codigo}</p></div></div></CardContent></Card>)}</div>}
    </div>
  );
}
export default SindicatoPage;
