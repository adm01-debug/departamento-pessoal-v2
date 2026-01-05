import React, { useState } from "react";
import { useEmprestimo } from "@/hooks/useEmprestimo";
import { EmprestimoList } from "@/components/emprestimo/EmprestimoList";
import { EmprestimoModal } from "@/components/emprestimo/EmprestimoModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, CreditCard, DollarSign, CheckCircle } from "lucide-react";
export function EmprestimoPage() {
  const { emprestimos, isLoading, create, update, remove } = useEmprestimo();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const filtered = emprestimos.filter(e => e.contrato?.toLowerCase().includes(search.toLowerCase()) || e.tipo?.toLowerCase().includes(search.toLowerCase()));
  const stats = { total: emprestimos.length, ativos: emprestimos.filter(e => e.situacao === "ATIVO").length, quitados: emprestimos.filter(e => e.situacao === "QUITADO").length, valorTotal: emprestimos.filter(e => e.situacao === "ATIVO").reduce((acc, e) => acc + (e.valorTotal - (e.parcelasPagas * e.valorParcela)), 0) };
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-3xl font-bold">Empréstimos Consignados</h1><p className="text-muted-foreground">Gerencie os empréstimos dos colaboradores</p></div><Button onClick={() => { setEditingId(null); setIsModalOpen(true); }}><Plus className="w-4 h-4 mr-2" />Novo Empréstimo</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4"><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CreditCard className="w-4 h-4" />Total</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><DollarSign className="w-4 h-4" />Ativos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-blue-600">{stats.ativos}</div></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />Quitados</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{stats.quitados}</div></CardContent></Card><Card><CardHeader className="pb-2"><CardTitle className="text-sm">Saldo Devedor</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">R$ {stats.valorTotal.toFixed(2)}</div></CardContent></Card></div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" /><Input placeholder="Buscar empréstimos..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
      <EmprestimoList emprestimos={filtered} onEdit={id => { setEditingId(id); setIsModalOpen(true); }} onDelete={remove} isLoading={isLoading} />
      <EmprestimoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} emprestimoId={editingId} onSave={editingId ? d => update(editingId, d) : create} />
    </div>
  );
}
export default EmprestimoPage;
