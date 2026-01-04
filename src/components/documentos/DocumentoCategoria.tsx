import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderOpen, Plus, Edit, Trash2, ChevronRight, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  cor: string;
  icone?: string;
  parent_id?: string;
  ordem: number;
  obrigatorio: boolean;
  prazo_dias?: number;
  quantidade_documentos: number;
  ativo: boolean;
}

interface DocumentoCategoriaProps {
  categorias: Categoria[];
  onCriar?: (categoria: Partial<Categoria>) => Promise<void>;
  onEditar?: (id: string, categoria: Partial<Categoria>) => Promise<void>;
  onExcluir?: (id: string) => Promise<void>;
  onSelecionar?: (categoria: Categoria) => void;
  categoriaSelecionada?: string;
  modoVisualizacao?: boolean;
}

const coresDisponiveis = [
  { value: "blue", label: "Azul", class: "bg-blue-500" },
  { value: "green", label: "Verde", class: "bg-green-500" },
  { value: "red", label: "Vermelho", class: "bg-red-500" },
  { value: "yellow", label: "Amarelo", class: "bg-yellow-500" },
  { value: "purple", label: "Roxo", class: "bg-purple-500" },
  { value: "orange", label: "Laranja", class: "bg-orange-500" },
  { value: "gray", label: "Cinza", class: "bg-gray-500" },
];

export function DocumentoCategoria({
  categorias,
  onCriar,
  onEditar,
  onExcluir,
  onSelecionar,
  categoriaSelecionada,
  modoVisualizacao = false
}: DocumentoCategoriaProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [form, setForm] = useState<Partial<Categoria>>({ nome: "", cor: "blue", obrigatorio: false });

  const handleSubmit = async () => {
    if (!form.nome) {
      toast({ title: "Erro", description: "Nome é obrigatório", variant: "destructive" });
      return;
    }
    try {
      if (editando) {
        await onEditar?.(editando.id, form);
        toast({ title: "Sucesso", description: "Categoria atualizada" });
      } else {
        await onCriar?.(form);
        toast({ title: "Sucesso", description: "Categoria criada" });
      }
      setForm({ nome: "", cor: "blue", obrigatorio: false });
      setEditando(null);
      setDialogOpen(false);
    } catch {
      toast({ title: "Erro", description: "Falha ao salvar categoria", variant: "destructive" });
    }
  };

  const handleEditar = (categoria: Categoria) => {
    setEditando(categoria);
    setForm(categoria);
    setDialogOpen(true);
  };

  const handleExcluir = async (id: string) => {
    if (!confirm("Deseja excluir esta categoria?")) return;
    try {
      await onExcluir?.(id);
      toast({ title: "Sucesso", description: "Categoria excluída" });
    } catch {
      toast({ title: "Erro", description: "Falha ao excluir", variant: "destructive" });
    }
  };

  const categoriasRaiz = categorias.filter(c => !c.parent_id);
  const getSubcategorias = (parentId: string) => categorias.filter(c => c.parent_id === parentId);

  const renderCategoria = (categoria: Categoria, nivel: number = 0) => {
    const subcategorias = getSubcategorias(categoria.id);
    const corConfig = coresDisponiveis.find(c => c.value === categoria.cor);
    const isSelected = categoriaSelecionada === categoria.id;

    return (
      <div key={categoria.id} style={{ marginLeft: nivel * 16 }}>
        <div
          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-muted/50 ${isSelected ? "bg-muted" : ""}`}
          onClick={() => onSelecionar?.(categoria)}
        >
          <div className="flex items-center gap-2">
            {subcategorias.length > 0 && <ChevronRight className="h-4 w-4" />}
            <div className={`w-3 h-3 rounded-full ${corConfig?.class || "bg-gray-500"}`} />
            <span className="font-medium">{categoria.nome}</span>
            <Badge variant="secondary" className="text-xs">{categoria.quantidade_documentos}</Badge>
            {categoria.obrigatorio && <Badge variant="destructive" className="text-xs">Obrigatório</Badge>}
          </div>
          {!modoVisualizacao && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100">
              <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); handleEditar(categoria); }}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); handleExcluir(categoria.id); }}><Trash2 className="h-4 w-4" /></Button>
            </div>
          )}
        </div>
        {subcategorias.map(sub => renderCategoria(sub, nivel + 1))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2"><FolderOpen className="h-5 w-5" />Categorias</CardTitle>
        {!modoVisualizacao && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-2" />Nova Categoria</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editando ? "Editar Categoria" : "Nova Categoria"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Nome</Label><Input value={form.nome || ""} onChange={e => setForm({ ...form, nome: e.target.value })} /></div>
                <div><Label>Descrição</Label><Input value={form.descricao || ""} onChange={e => setForm({ ...form, descricao: e.target.value })} /></div>
                <div><Label>Cor</Label>
                  <Select value={form.cor} onValueChange={v => setForm({ ...form, cor: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{coresDisponiveis.map(c => <SelectItem key={c.value} value={c.value}><div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${c.class}`} />{c.label}</div></SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Categoria Pai</Label>
                  <Select value={form.parent_id || "none"} onValueChange={v => setForm({ ...form, parent_id: v === "none" ? undefined : v })}>
                    <SelectTrigger><SelectValue placeholder="Nenhuma (raiz)" /></SelectTrigger>
                    <SelectContent><SelectItem value="none">Nenhuma (raiz)</SelectItem>{categorias.filter(c => c.id !== editando?.id).map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={form.obrigatorio || false} onChange={e => setForm({ ...form, obrigatorio: e.target.checked })} />
                  <Label>Documento obrigatório nesta categoria</Label>
                </div>
                {form.obrigatorio && <div><Label>Prazo (dias)</Label><Input type="number" value={form.prazo_dias || ""} onChange={e => setForm({ ...form, prazo_dias: parseInt(e.target.value) })} /></div>}
                <Button onClick={handleSubmit} className="w-full">{editando ? "Salvar" : "Criar"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">{categoriasRaiz.map(c => renderCategoria(c))}</div>
        {categorias.length === 0 && <p className="text-center text-muted-foreground py-4">Nenhuma categoria cadastrada</p>}
      </CardContent>
    </Card>
  );
}

export default DocumentoCategoria;
