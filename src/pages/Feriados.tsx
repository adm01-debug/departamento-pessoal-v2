/**
 * @fileoverview Página de Gestão de Feriados
 * @module pages/Feriados
 * @version V8.4 - Implementação completa
 */
import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  CalendarDays, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Loader2,
  MapPin,
  Globe,
  Building2,
  PartyPopper
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ============================================
// TIPOS
// ============================================

interface Feriado {
  id: string;
  nome: string;
  data: string;
  tipo: 'nacional' | 'estadual' | 'municipal' | 'ponto_facultativo' | 'empresa';
  recorrente: boolean;
  estado?: string;
  cidade?: string;
  ativo: boolean;
}

interface FeriadoFormData {
  nome: string;
  data: Date | undefined;
  tipo: string;
  recorrente: boolean;
  estado: string;
  cidade: string;
  ativo: boolean;
}

const INITIAL_FORM: FeriadoFormData = {
  nome: '',
  data: undefined,
  tipo: 'nacional',
  recorrente: true,
  estado: '',
  cidade: '',
  ativo: true,
};

// Feriados nacionais padrão 2025
const FERIADOS_2025: Feriado[] = [
  { id: '1', nome: 'Confraternização Universal', data: '2025-01-01', tipo: 'nacional', recorrente: true, ativo: true },
  { id: '2', nome: 'Carnaval', data: '2025-03-03', tipo: 'ponto_facultativo', recorrente: false, ativo: true },
  { id: '3', nome: 'Carnaval', data: '2025-03-04', tipo: 'ponto_facultativo', recorrente: false, ativo: true },
  { id: '4', nome: 'Quarta-feira de Cinzas', data: '2025-03-05', tipo: 'ponto_facultativo', recorrente: false, ativo: true },
  { id: '5', nome: 'Sexta-feira Santa', data: '2025-04-18', tipo: 'nacional', recorrente: false, ativo: true },
  { id: '6', nome: 'Tiradentes', data: '2025-04-21', tipo: 'nacional', recorrente: true, ativo: true },
  { id: '7', nome: 'Dia do Trabalho', data: '2025-05-01', tipo: 'nacional', recorrente: true, ativo: true },
  { id: '8', nome: 'Corpus Christi', data: '2025-06-19', tipo: 'ponto_facultativo', recorrente: false, ativo: true },
  { id: '9', nome: 'Independência do Brasil', data: '2025-09-07', tipo: 'nacional', recorrente: true, ativo: true },
  { id: '10', nome: 'Nossa Sra. Aparecida', data: '2025-10-12', tipo: 'nacional', recorrente: true, ativo: true },
  { id: '11', nome: 'Finados', data: '2025-11-02', tipo: 'nacional', recorrente: true, ativo: true },
  { id: '12', nome: 'Proclamação da República', data: '2025-11-15', tipo: 'nacional', recorrente: true, ativo: true },
  { id: '13', nome: 'Consciência Negra', data: '2025-11-20', tipo: 'nacional', recorrente: true, ativo: true },
  { id: '14', nome: 'Natal', data: '2025-12-25', tipo: 'nacional', recorrente: true, ativo: true },
];

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 
  'SP', 'SE', 'TO'
];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const FeriadosPage = memo(function FeriadosPage() {
  useEffect(() => {
    document.title = 'Feriados | DP System';
  }, []);

  const [feriados, setFeriados] = useState<Feriado[]>(FERIADOS_2025);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroAno, setFiltroAno] = useState<string>('2025');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFeriado, setEditingFeriado] = useState<Feriado | null>(null);
  const [formData, setFormData] = useState<FeriadoFormData>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Feriados filtrados
  const feriadosFiltrados = useMemo(() => {
    return feriados.filter(f => {
      const matchSearch = !searchTerm || f.nome.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTipo = filtroTipo === 'todos' || f.tipo === filtroTipo;
      const matchAno = f.data.startsWith(filtroAno);
      return matchSearch && matchTipo && matchAno;
    });
  }, [feriados, searchTerm, filtroTipo, filtroAno]);

  // Estatísticas
  const stats = useMemo(() => ({
    total: feriadosFiltrados.length,
    nacionais: feriadosFiltrados.filter(f => f.tipo === 'nacional').length,
    facultativos: feriadosFiltrados.filter(f => f.tipo === 'ponto_facultativo').length,
    proximoFeriado: feriadosFiltrados
      .filter(f => new Date(f.data) >= new Date())
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())[0],
  }), [feriadosFiltrados]);

  // Abrir modal
  const handleNovo = useCallback(() => {
    setEditingFeriado(null);
    setFormData(INITIAL_FORM);
    setModalOpen(true);
  }, []);

  // Editar
  const handleEditar = useCallback((feriado: Feriado) => {
    setEditingFeriado(feriado);
    setFormData({
      nome: feriado.nome,
      data: new Date(feriado.data + 'T12:00:00'),
      tipo: feriado.tipo,
      recorrente: feriado.recorrente,
      estado: feriado.estado || '',
      cidade: feriado.cidade || '',
      ativo: feriado.ativo,
    });
    setModalOpen(true);
  }, []);

  // Salvar
  const handleSalvar = useCallback(async () => {
    if (!formData.nome || !formData.data) {
      toast.error('Nome e data são obrigatórios');
      return;
    }

    setSaving(true);
    await new Promise(r => setTimeout(r, 500));

    const novoFeriado: Feriado = {
      id: editingFeriado?.id || String(Date.now()),
      nome: formData.nome,
      data: format(formData.data, 'yyyy-MM-dd'),
      tipo: formData.tipo as Feriado['tipo'],
      recorrente: formData.recorrente,
      estado: formData.estado || undefined,
      cidade: formData.cidade || undefined,
      ativo: formData.ativo,
    };

    if (editingFeriado) {
      setFeriados(prev => prev.map(f => f.id === editingFeriado.id ? novoFeriado : f));
      toast.success('Feriado atualizado!');
    } else {
      setFeriados(prev => [...prev, novoFeriado]);
      toast.success('Feriado cadastrado!');
    }

    setModalOpen(false);
    setSaving(false);
  }, [formData, editingFeriado]);

  // Excluir
  const handleExcluir = useCallback((id: string) => {
    setFeriados(prev => prev.filter(f => f.id !== id));
    toast.success('Feriado excluído!');
    setDeleteConfirm(null);
  }, []);

  // Badge de tipo
  const getTipoBadge = (tipo: string) => {
    const styles: Record<string, string> = {
      nacional: 'bg-green-100 text-green-800',
      estadual: 'bg-blue-100 text-blue-800',
      municipal: 'bg-purple-100 text-purple-800',
      ponto_facultativo: 'bg-yellow-100 text-yellow-800',
      empresa: 'bg-orange-100 text-orange-800',
    };
    const labels: Record<string, string> = {
      nacional: 'Nacional',
      estadual: 'Estadual',
      municipal: 'Municipal',
      ponto_facultativo: 'Ponto Facultativo',
      empresa: 'Empresa',
    };
    return <Badge className={styles[tipo]}>{labels[tipo]}</Badge>;
  };

  return (
    <>
      <SEOHead title="Feriados" description="Gestão de feriados" />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CalendarDays className="h-8 w-8" />
              Feriados
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie feriados e pontos facultativos
            </p>
          </div>
          <Button onClick={handleNovo}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Feriado
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CalendarDays className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total {filtroAno}</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nacionais</p>
                  <p className="text-2xl font-bold">{stats.nacionais}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Facultativos</p>
                  <p className="text-2xl font-bold">{stats.facultativos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <PartyPopper className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Próximo</p>
                  <p className="text-lg font-bold">
                    {stats.proximoFeriado 
                      ? format(new Date(stats.proximoFeriado.data + 'T12:00:00'), 'dd/MM', { locale: ptBR })
                      : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar feriado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="nacional">Nacional</SelectItem>
              <SelectItem value="estadual">Estadual</SelectItem>
              <SelectItem value="municipal">Municipal</SelectItem>
              <SelectItem value="ponto_facultativo">Ponto Facultativo</SelectItem>
              <SelectItem value="empresa">Empresa</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filtroAno} onValueChange={setFiltroAno}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabela */}
        <Card>
          <CardHeader>
            <CardTitle>Calendário de Feriados</CardTitle>
            <CardDescription>{feriadosFiltrados.length} feriado(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : feriadosFiltrados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum feriado encontrado</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Recorrente</TableHead>
                    <TableHead>Abrangência</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feriadosFiltrados
                    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                    .map((feriado) => (
                    <TableRow key={feriado.id}>
                      <TableCell className="font-mono">
                        {format(new Date(feriado.data + 'T12:00:00'), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className="font-medium">{feriado.nome}</TableCell>
                      <TableCell>{getTipoBadge(feriado.tipo)}</TableCell>
                      <TableCell>
                        <Badge variant={feriado.recorrente ? 'default' : 'outline'}>
                          {feriado.recorrente ? 'Sim' : 'Não'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {feriado.tipo === 'nacional' ? 'Brasil' : 
                         feriado.estado ? `${feriado.estado}${feriado.cidade ? ` - ${feriado.cidade}` : ''}` : '-'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditar(feriado)}>
                              <Edit className="h-4 w-4 mr-2" />Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setDeleteConfirm(feriado.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />Excluir
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
              <DialogTitle>{editingFeriado ? 'Editar' : 'Novo'} Feriado</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Dia do Trabalho"
                />
              </div>
              <div className="space-y-2">
                <Label>Data *</Label>
                <Calendar
                  mode="single"
                  selected={formData.data}
                  onSelect={(date) => setFormData(prev => ({ ...prev, data: date }))}
                  locale={ptBR}
                  className="rounded-md border"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, tipo: v }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nacional">Nacional</SelectItem>
                      <SelectItem value="estadual">Estadual</SelectItem>
                      <SelectItem value="municipal">Municipal</SelectItem>
                      <SelectItem value="ponto_facultativo">Ponto Facultativo</SelectItem>
                      <SelectItem value="empresa">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, estado: v }))}
                    disabled={formData.tipo === 'nacional'}
                  >
                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      {ESTADOS.map(uf => (
                        <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.recorrente}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, recorrente: checked }))}
                />
                <Label>Recorrente (repete todo ano)</Label>
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
              <DialogDescription>Tem certeza que deseja excluir este feriado?</DialogDescription>
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

export default FeriadosPage;
