import React, { useState } from "react";
import { useLotacao } from "@/hooks/useLotacao";
import { LotacaoList } from "@/components/lotacao/LotacaoList";
import { LotacaoModal } from "@/components/lotacao/LotacaoModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Building, FolderTree } from "lucide-react";
export function LotacaoPage() {
  const { lotacoes, isLoading, create, update, remove } = useLotacao();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const filtered = lotacoes.filter(l => l.descricao?.toLowerCase().includes(search.toLowerCase()) || l.codigo?.toLowerCase().includes(search.toLowerCase()));
  const stats = { total: lotacoes.length, ativos: lotacoes.filter(l => l.ativo).length, centros: lotacoes.filter(l => l.tipo === "CENTRO_CUSTO").length };
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-3xl font-bold">Lotações / Centros de Custo</h1><p className="text-muted-foreground">Gerencie as lotações tributárias e centros de custo</p></div><Button onClick={() => { setEditingId(null); setIsModalOpen(true); }}><Plus className="w-4 h-4 mr-2" />Nova Lotação</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FolderTree className="w-4 h-4" />Total</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Building className="w-4 h-4" />Ativos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{stats.ativos}</div></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm">Centros Custo</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.centros}</div></CardContent></Card></div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" /><Input placeholder="Buscar lotações..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
      <LotacaoList lotacoes={filtered} onEdit={id => { setEditingId(id); setIsModalOpen(true); }} onDelete={remove} isLoading={isLoading} />
      <LotacaoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} lotacaoId={editingId} onSave={editingId ? d => update(editingId, d) : create} />
    </div>
  );
}
export default LotacaoPage;
