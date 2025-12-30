/**
 * @fileoverview Página de Gestão de Departamentos
 * @module pages/Departamentos
 * @version V8.4 - Implementação completa
 */
import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Building2, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Users,
  Loader2,
  FolderTree,
  UserCircle,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// ============================================
// TIPOS
// ============================================

interface Departamento {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  responsavel_id?: string;
  responsavel_nome?: string;
  departamento_pai_id?: string;
  departamento_pai_nome?: string;
  ativo: boolean;
  colaboradores_count?: number;
  created_at: string;
}

interface DepartamentoFormData {
  nome: string;
  descricao: string;
  codigo: string;
  responsavel_id: string;
  departamento_pai_id: string;
  ativo: boolean;
}

const INITIAL_FORM: DepartamentoFormData = {
  nome: '',
  descricao: '',
  codigo: '',
  responsavel_id: '',
  departamento_pai_id: '',
  ativo: true,
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const DepartamentosPage = memo(function DepartamentosPage() {
  useEffect(() => {
    document.title = 'Departamentos | DP System';
  }, []);

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Departamento | null>(null);
  const [formData, setFormData] = useState<DepartamentoFormData>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [colaboradores, setColaboradores] = useState<Array<{id: string; nome: string}>>([]);

  // Carregar departamentos
  const fetchDepartamentos = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .order('nome');

      if (error) throw error;
      setDepartamentos(data || []);
    } catch (error) {
      toast.error('Erro ao carregar departamentos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar colaboradores para responsável
  const fetchColaboradores = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('colaboradores')
        .select('id, nome_completo')
        .eq('status', 'ativo')
        .order('nome_completo');
      
      setColaboradores(data?.map(c => ({ id: c.id, nome: c.nome_completo })) || []);
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
    }
  }, []);

  useEffect(() => {
    fetchDepartamentos();
    fetchColaboradores();
  }, [fetchDepartamentos, fetchColaboradores]);

  // Departamentos filtrados
  const departamentosFiltrados = useMemo(() => {
    if (!searchTerm) return departamentos;
    const term = searchTerm.toLowerCase();
    return departamentos.filter(d => 
      d.nome?.toLowerCase().includes(term) ||
      d.codigo?.toLowerCase().includes(term)
    );
  }, [departamentos, searchTerm]);

  // Estatísticas
  const stats = useMemo(() => ({
    total: departamentos.length,
    ativos: departamentos.filter(d => d.ativo !== false).length,
    comResponsavel: departamentos.filter(d => d.responsavel_id).length,
  }), [departamentos]);

  // Abrir modal para novo
  const handleNovo = useCallback(() => {
    setEditingDept(null);
    setFormData(INITIAL_FORM);
    setModalOpen(true);
  }, []);

  // Abrir modal para editar
  const handleEditar = useCallback((dept: Departamento) => {
    setEditingDept(dept);
    setFormData({
      nome: dept.nome || '',
      descricao: dept.descricao || '',
      codigo: dept.codigo || '',
      responsavel_id: dept.responsavel_id || '',
      departamento_pai_id: dept.departamento_pai_id || '',
      ativo: dept.ativo !== false,
    });
    setModalOpen(true);
  }, []);

  // Salvar
  const handleSalvar = useCallback(async () => {
    if (!formData.nome) {
      toast.error('Nome é obrigatório');
      return;
    }

    setSaving(true);
    try {
      if (editingDept) {
        const { error } = await supabase
          .from('departamentos')
          .update({
            nome: formData.nome,
            descricao: formData.descricao || null,
            codigo: formData.codigo || null,
            responsavel_id: formData.responsavel_id || null,
            departamento_pai_id: formData.departamento_pai_id || null,
            ativo: formData.ativo,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingDept.id);

        if (error) throw error;
        toast.success('Departamento atualizado!');
      } else {
        const { error } = await supabase
          .from('departamentos')
          .insert({
            nome: formData.nome,
            descricao: formData.descricao || null,
            codigo: formData.codigo || null,
            responsavel_id: formData.responsavel_id || null,
            departamento_pai_id: formData.departamento_pai_id || null,
            ativo: formData.ativo,
          });

        if (error) throw error;
        toast.success('Departamento cadastrado!');
      }
      
      setModalOpen(false);
      fetchDepartamentos();
    } catch (error) {
      toast.error('Erro ao salvar departamento');
    } finally {
      setSaving(false);
    }
  }, [formData, editingDept, fetchDepartamentos]);

  // Excluir
  const handleExcluir = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('departamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Departamento excluído!');
      setDeleteConfirm(null);
      fetchDepartamentos();
    } catch (error) {
      toast.error('Erro ao excluir departamento');
    }
  }, [fetchDepartamentos]);

  return (
    <>
      <SEOHead title="Departamentos" description="Gestão de departamentos" />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FolderTree className="h-8 w-8" />
              Departamentos
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie a estrutura organizacional
            </p>
          </div>
          <Button onClick={handleNovo}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Departamento
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FolderTree className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ativos</p>
                  <p className="text-2xl font-bold">{stats.ativos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <UserCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Com Responsável</p>
                  <p className="text-2xl font-bold">{stats.comResponsavel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Busca */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabela */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Departamentos</CardTitle>
            <CardDescription>
              {departamentosFiltrados.length} departamento(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : departamentosFiltrados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FolderTree className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum departamento encontrado</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departamentosFiltrados.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{dept.nome}</p>
                          {dept.descricao && (
                            <p className="text-sm text-muted-foreground line-clamp-1">{dept.descricao}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{dept.codigo || '-'}</TableCell>
                      <TableCell>{dept.responsavel_nome || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={dept.ativo !== false ? 'default' : 'secondary'}>
                          {dept.ativo !== false ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditar(dept)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setDeleteConfirm(dept.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDept ? 'Editar' : 'Novo'} Departamento</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome *</Label>
                  <Input
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Código</Label>
                  <Input
                    value={formData.codigo}
                    onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Responsável</Label>
                <Select
                  value={formData.responsavel_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, responsavel_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {colaboradores.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Departamento Pai</Label>
                <Select
                  value={formData.departamento_pai_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, departamento_pai_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nenhum (raiz)" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.filter(d => d.id !== editingDept?.id).map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSalvar} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmação de Exclusão */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>Tem certeza que deseja excluir este departamento?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={() => deleteConfirm && handleExcluir(deleteConfirm)}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
});

export default DepartamentosPage;
