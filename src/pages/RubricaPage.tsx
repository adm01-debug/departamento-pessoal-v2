import React, { useState } from "react";
import { useRubrica } from "@/hooks/useRubrica";
import { RubricaList } from "@/components/rubrica/RubricaList";
import { RubricaModal } from "@/components/rubrica/RubricaModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
export function RubricaPage() {
  const { rubricas, isLoading, create, update, remove } = useRubrica();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const filtered = rubricas.filter(r => r.descricao?.toLowerCase().includes(search.toLowerCase()) || r.codigo?.toLowerCase().includes(search.toLowerCase()));
  const stats = { total: rubricas.length, proventos: rubricas.filter(r => r.tipo === "PROVENTO").length, descontos: rubricas.filter(r => r.tipo === "DESCONTO").length };
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-3xl font-bold">Rubricas / Verbas</h1><p className="text-muted-foreground">Gerencie as rubricas da folha de pagamento</p></div><Button onClick={() => { setEditingId(null); setIsModalOpen(true); }}><Plus className="w-4 h-4 mr-2" />Nova Rubrica</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><DollarSign className="w-4 h-4" />Total</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-600" />Proventos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{stats.proventos}</div></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingDown className="w-4 h-4 text-red-600" />Descontos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{stats.descontos}</div></CardContent></Card></div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" /><Input placeholder="Buscar rubricas..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
      <RubricaList rubricas={filtered} onEdit={id => { setEditingId(id); setIsModalOpen(true); }} onDelete={remove} isLoading={isLoading} />
      <RubricaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} rubricaId={editingId} onSave={editingId ? d => update(editingId, d) : create} />
    </div>
  );
}
export default RubricaPage;
