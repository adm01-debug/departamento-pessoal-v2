import React, { useState } from "react";
import { useJornada } from "@/hooks/useJornada";
import { JornadaList } from "@/components/jornada/JornadaList";
import { JornadaForm } from "@/components/jornada/JornadaForm";
import { JornadaModal } from "@/components/jornada/JornadaModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Clock, Users, Calendar } from "lucide-react";

export function JornadaPage() {
  const { jornadas, isLoading, create, update, remove } = useJornada();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = jornadas.filter(j =>
    j.descricao?.toLowerCase().includes(search.toLowerCase()) ||
    j.codigo?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: jornadas.length,
    ativos: jornadas.filter(j => j.ativo).length,
    normal: jornadas.filter(j => j.tipo === "NORMAL").length,
    escala: jornadas.filter(j => j.tipo === "ESCALA").length,
  };

  const handleEdit = (id: string) => { setEditingId(id); setIsModalOpen(true); };
  const handleNew = () => { setEditingId(null); setIsModalOpen(true); };
  const handleClose = () => { setIsModalOpen(false); setEditingId(null); };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Jornadas de Trabalho</h1>
          <p className="text-muted-foreground">Gerencie as jornadas de trabalho da empresa</p>
        </div>
        <Button onClick={handleNew}><Plus className="w-4 h-4 mr-2" />Nova Jornada</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Clock className="w-4 h-4" />Total</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Users className="w-4 h-4" />Ativas</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{stats.ativos}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Calendar className="w-4 h-4" />Normal</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.normal}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Escala</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.escala}</div></CardContent></Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" /><Input placeholder="Buscar jornadas..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
      </div>

      <JornadaList jornadas={filtered} onEdit={handleEdit} onDelete={remove} isLoading={isLoading} />
      <JornadaModal isOpen={isModalOpen} onClose={handleClose} jornadaId={editingId} onSave={editingId ? (data) => update(editingId, data) : create} />
    </div>
  );
}

export default JornadaPage;
