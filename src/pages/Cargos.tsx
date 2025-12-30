/**
 * @fileoverview Página de Gestão de Cargos
 * @module pages/Cargos
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
  Briefcase, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Users,
  Loader2,
  DollarSign,
  TrendingUp,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// ============================================
// TIPOS
// ============================================

interface Cargo {
  id: string;
  nome: string;
  descricao?: string;
  cbo?: string;
  departamento_id?: string;
  departamento_nome?: string;
  nivel: 'junior' | 'pleno' | 'senior' | 'especialista' | 'coordenador' | 'gerente' | 'diretor';
  salario_min?: number;
  salario_max?: number;
  ativo: boolean;
  colaboradores_count?: number;
  created_at: string;
}

interface CargoFormData {
  nome: string;
  descricao: string;
  cbo: string;
  departamento_id: string;
  nivel: string;
  salario_min: string;
  salario_max: string;
  ativo: boolean;
}

const INITIAL_FORM: CargoFormData = {
  nome: '',
  descricao: '',
  cbo: '',
  departamento_id: '',
  nivel: 'pleno',
  salario_min: '',
  salario_max: '',
  ativo: true,
};

const NIVEIS = [
  { value: 'junior', label: 'Júnior' },
  { value: 'pleno', label: 'Pleno' },
  { value: 'senior', label: 'Sênior' },
  { value: 'especialista', label: 'Especialista' },
  { value: 'coordenador', label: 'Coordenador' },
  { value: 'gerente', label: 'Gerente' },
  { value: 'diretor', label: 'Diretor' },
];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const CargosPage = memo(function CargosPage() {
  useEffect(() => {
    document.title = 'Cargos | DP System';
  }, []);

  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [departamentos, setDepartamentos] = useState<Array<{id: string; nome: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCargo, setEditingCargo] = useState<Cargo | null>(null);
  const [formData, setFormData] = useState<CargoFormData>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Carregar cargos
  const fetchCargos = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cargos')
        .select('*')
        .order('nome');

      if (error) throw error;
      setCargos(data || []);
    } catch (error) {
      toast.error('Erro ao carregar cargos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar departamentos
  const fetchDepartamentos = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('departamentos')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome');
      
      setDepartamentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error);
    }
  }, []);

  useEffect(() => {
    fetchCargos();
    fetchDepartamentos();
  }, [fetchCargos, fetchDepartamentos]);

  // Cargos filtrados
  const cargosFiltrados = useMemo(() => {
    if (!searchTerm) return cargos;
    const term = searchTerm.toLowerCase();
    return cargos.filter(c => 
      c.nome?.toLowerCase().includes(term) ||
      c.cbo?.includes(term)
    );
  }, [cargos, searchTerm]);

  // Estatísticas
  const stats = useMemo(() => ({
    total: cargos.length,
    ativos: cargos.filter(c => c.ativo !== false).length,
    mediaSalarial: cargos.length > 0 
      ? cargos.reduce((sum, c) => sum + ((c.salario_min || 0) + (c.salario_max || 0)) / 2, 0) / cargos.length
      : 0,
  }), [cargos]);

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Abrir modal
  const handleNovo = useCallback(() => {
    setEditingCargo(null);
    setFormData(INITIAL_FORM);
    setModalOpen(true);
  }, []);

  // Editar
  const handleEditar = useCallback((cargo: Cargo) => {
    setEditingCargo(cargo);
    setFormData({
      nome: cargo.nome || '',
      descricao: cargo.descricao || '',
      cbo: cargo.cbo || '',
      departamento_id: cargo.departamento_id || '',
      nivel: cargo.nivel || 'pleno',
      salario_min: cargo.salario_min?.toString() || '',
      salario_max: cargo.salario_max?.toString() || '',
      ativo: cargo.ativo !== false,
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
      const payload = {
        nome: formData.nome,
        descricao: formData.descricao || null,
        cbo: formData.cbo || null,
        departamento_id: formData.departamento_id || null,
        nivel: formData.nivel,
        salario_min: formData.salario_min ? parseFloat(formData.salario_min) : null,
        salario_max: formData.salario_max ? parseFloat(formData.salario_max) : null,
        ativo: formData.ativo,
      };

      if (editingCargo) {
        const { error } = await supabase
          .from('cargos')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', editingCargo.id);
        if (error) throw error;
        toast.success('Cargo atualizado!');
      } else {
        const { error } = await supabase.from('cargos').insert(payload);
        if (error) throw error;
        toast.success('Cargo cadastrado!');
      }
      
      setModalOpen(false);
      fetchCargos();
    } catch (error) {
      toast.error('Erro ao salvar cargo');
    } finally {
      setSaving(false);
    }
  }, [formData, editingCargo, fetchCargos]);

  // Excluir
  const handleExcluir = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('cargos').delete().eq('id', id);
      if (error) throw error;
      toast.success('Cargo excluído!');
      setDeleteConfirm(null);
      fetchCargos();
    } catch (error) {
      toast.error('Erro ao excluir cargo');
    }
  }, [fetchCargos]);

  // Badge de nível
  const getNivelBadge = (nivel: string) => {
    const colors: Record<string, string> = {
      junior: 'bg-green-100 text-green-800',
      pleno: 'bg-blue-100 text-blue-800',
      senior: 'bg-purple-100 text-purple-800',
      especialista: 'bg-orange-100 text-orange-800',
      coordenador: 'bg-pink-100 text-pink-800',
      gerente: 'bg-red-100 text-red-800',
      diretor: 'bg-yellow-100 text-yellow-800',
    };
    const label = NIVEIS.find(n => n.value === nivel)?.label || nivel;
    return <Badge className={colors[nivel] || 'bg-gray-100'}>{label}</Badge>;
  };

  return (
    <>
      <SEOHead title="Cargos" description="Gestão de cargos" />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Briefcase className="h-8 w-8" />
              Cargos
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os cargos da organização
            </p>
          </div>
          <Button onClick={handleNovo}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cargo
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Cargos</p>
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
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Média Salarial</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.mediaSalarial)}</p>
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
              placeholder="Buscar cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabela */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Cargos</CardTitle>
            <CardDescription>{cargosFiltrados.length} cargo(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : cargosFiltrados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum cargo encontrado</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cargo</TableHead>
                    <TableHead>CBO</TableHead>
                    <TableHead>Nível</TableHead>
                    <TableHead>Faixa Salarial</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cargosFiltrados.map((cargo) => (
                    <TableRow key={cargo.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{cargo.nome}</p>
                          {cargo.descricao && (
                            <p className="text-sm text-muted-foreground line-clamp-1">{cargo.descricao}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{cargo.cbo || '-'}</TableCell>
                      <TableCell>{getNivelBadge(cargo.nivel)}</TableCell>
                      <TableCell>
                        {cargo.salario_min || cargo.salario_max ? (
                          <span className="text-sm">
                            {cargo.salario_min ? formatCurrency(cargo.salario_min) : '-'}
                            {' - '}
                            {cargo.salario_max ? formatCurrency(cargo.salario_max) : '-'}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={cargo.ativo !== false ? 'default' : 'secondary'}>
                          {cargo.ativo !== false ? 'Ativo' : 'Inativo'}
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
                            <DropdownMenuItem onClick={() => handleEditar(cargo)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setDeleteConfirm(cargo.id)}
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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCargo ? 'Editar' : 'Novo'} Cargo</DialogTitle>
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
                  <Label>CBO</Label>
                  <Input
                    value={formData.cbo}
                    onChange={(e) => setFormData(prev => ({ ...prev, cbo: e.target.value }))}
                    placeholder="Ex: 2521-05"
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Departamento</Label>
                  <Select
                    value={formData.departamento_id}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, departamento_id: v }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {departamentos.map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nível</Label>
                  <Select
                    value={formData.nivel}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, nivel: v }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {NIVEIS.map(n => (
                        <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Salário Mínimo</Label>
                  <Input
                    type="number"
                    value={formData.salario_min}
                    onChange={(e) => setFormData(prev => ({ ...prev, salario_min: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Salário Máximo</Label>
                  <Input
                    type="number"
                    value={formData.salario_max}
                    onChange={(e) => setFormData(prev => ({ ...prev, salario_max: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSalvar} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
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
              <DialogDescription>Tem certeza que deseja excluir este cargo?</DialogDescription>
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

export default CargosPage;
