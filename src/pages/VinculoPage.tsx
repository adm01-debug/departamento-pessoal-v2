import React, { useState } from "react";
import { useVinculo } from "@/hooks/useVinculo";
import { VinculoList } from "@/components/vinculo/VinculoList";
import { VinculoModal } from "@/components/vinculo/VinculoModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Link, Users } from "lucide-react";
export function VinculoPage() {
  const { vinculos, isLoading, create, update, remove } = useVinculo();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const filtered = vinculos.filter(v => v.matricula?.toLowerCase().includes(search.toLowerCase()));
  const stats = { total: vinculos.length, ativos: vinculos.filter(v => v.ativo).length, clt: vinculos.filter(v => v.tipoVinculo === "CLT").length };
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-3xl font-bold">Vínculos Empregatícios</h1><p className="text-muted-foreground">Gerencie os vínculos dos colaboradores</p></div><Button onClick={() => { setEditingId(null); setIsModalOpen(true); }}><Plus className="w-4 h-4 mr-2" />Novo Vínculo</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Link className="w-4 h-4" />Total</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Users className="w-4 h-4" />Ativos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{stats.ativos}</div></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm">CLT</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.clt}</div></CardContent></Card></div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" /><Input placeholder="Buscar por matrícula..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
      <VinculoList vinculos={filtered} onEdit={id => { setEditingId(id); setIsModalOpen(true); }} onDelete={remove} isLoading={isLoading} />
      <VinculoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} vinculoId={editingId} onSave={editingId ? d => update(editingId, d) : create} />
    </div>
  );
}
export default VinculoPage;
