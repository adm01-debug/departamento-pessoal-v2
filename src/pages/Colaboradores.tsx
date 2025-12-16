import { useState, useMemo } from 'react';
import { Search, Plus, MoreVertical, X, SlidersHorizontal, ArrowUpDown, ArrowUp, ArrowDown, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockColaboradores, statusColors, Colaborador } from '@/data/mockData';
import { ColaboradorModal } from '@/components/colaboradores/ColaboradorModal';
import { ColaboradorFormModal, ColaboradorFormData } from '@/components/colaboradores/ColaboradorFormModal';
import { cn } from '@/lib/utils';

const statusLabels: Record<string, string> = {
  ativo: 'Ativo',
  ferias: 'Férias',
  afastado: 'Afastado',
  desligado: 'Desligado',
  admissao: 'Em Admissão',
};

const statusOptions = ['todos', 'ativo', 'ferias', 'afastado', 'desligado', 'admissao'];

type SortColumn = 'nome' | 'dataAdmissao' | 'departamento' | null;
type SortDirection = 'asc' | 'desc';

export default function Colaboradores() {
  // Lista de colaboradores (state local para persistência)
  const [colaboradores, setColaboradores] = useState<Colaborador[]>(mockColaboradores);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [departamentoFilter, setDepartamentoFilter] = useState('todos');
  const [cargoFilter, setCargoFilter] = useState('todos');
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Modal state
  const [selectedColaborador, setSelectedColaborador] = useState<Colaborador | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState<Colaborador | null>(null);

  // Extrair valores únicos para os filtros
  const departamentos = useMemo(() => {
    const unique = [...new Set(colaboradores.map(c => c.departamento))];
    return ['todos', ...unique.sort()];
  }, [colaboradores]);

  const cargos = useMemo(() => {
    const unique = [...new Set(colaboradores.map(c => c.cargo))];
    return ['todos', ...unique.sort()];
  }, [colaboradores]);

  // Handler para criar/editar colaborador
  const handleSaveColaborador = (data: ColaboradorFormData, isEdit: boolean) => {
    if (isEdit && editingColaborador) {
      // Atualizar colaborador existente
      setColaboradores(prev => prev.map(c => 
        c.id === editingColaborador.id
          ? {
              ...c,
              nome: data.nome,
              matricula: data.matricula,
              cargo: data.cargo,
              departamento: data.departamento,
              status: data.status,
              dataAdmissao: data.dataAdmissao,
              salario: parseFloat(data.salario),
              gestor: data.gestor || undefined,
            }
          : c
      ));
    } else {
      // Criar novo colaborador
      const novoColaborador: Colaborador = {
        id: `${Date.now()}`,
        nome: data.nome,
        matricula: data.matricula,
        cargo: data.cargo,
        departamento: data.departamento,
        status: data.status,
        dataAdmissao: data.dataAdmissao,
        salario: parseFloat(data.salario),
        gestor: data.gestor || undefined,
      };
      setColaboradores(prev => [novoColaborador, ...prev]);
    }
    setEditingColaborador(null);
  };

  // Abrir modal para novo colaborador
  const handleOpenNewModal = () => {
    setEditingColaborador(null);
    setFormModalOpen(true);
  };

  // Abrir modal para editar colaborador
  const handleOpenEditModal = (colaborador: Colaborador) => {
    setEditingColaborador(colaborador);
    setFormModalOpen(true);
  };

  // Filtrar e ordenar colaboradores
  const filteredColaboradores = useMemo(() => {
    let result = colaboradores.filter(c => {
      const matchSearch = search === '' || 
        c.nome.toLowerCase().includes(search.toLowerCase()) ||
        c.matricula.toLowerCase().includes(search.toLowerCase()) ||
        c.cargo.toLowerCase().includes(search.toLowerCase()) ||
        c.departamento.toLowerCase().includes(search.toLowerCase());
      
      const matchStatus = statusFilter === 'todos' || c.status === statusFilter;
      const matchDepartamento = departamentoFilter === 'todos' || c.departamento === departamentoFilter;
      const matchCargo = cargoFilter === 'todos' || c.cargo === cargoFilter;

      return matchSearch && matchStatus && matchDepartamento && matchCargo;
    });

    // Aplicar ordenação
    if (sortColumn) {
      result = [...result].sort((a, b) => {
        let comparison = 0;
        
        if (sortColumn === 'nome') {
          comparison = a.nome.localeCompare(b.nome, 'pt-BR');
        } else if (sortColumn === 'dataAdmissao') {
          comparison = new Date(a.dataAdmissao).getTime() - new Date(b.dataAdmissao).getTime();
        } else if (sortColumn === 'departamento') {
          comparison = a.departamento.localeCompare(b.departamento, 'pt-BR');
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [colaboradores, search, statusFilter, departamentoFilter, cargoFilter, sortColumn, sortDirection]);

  // Função para alternar ordenação
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Componente do ícone de ordenação
  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground/50" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-3.5 h-3.5 text-primary" />
      : <ArrowDown className="w-3.5 h-3.5 text-primary" />;
  };

  // Verificar se há filtros ativos
  const hasActiveFilters = statusFilter !== 'todos' || departamentoFilter !== 'todos' || cargoFilter !== 'todos' || search !== '';
  
  const activeFilterCount = [
    statusFilter !== 'todos',
    departamentoFilter !== 'todos',
    cargoFilter !== 'todos',
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearch('');
    setStatusFilter('todos');
    setDepartamentoFilter('todos');
    setCargoFilter('todos');
  };

  const handleRowClick = (colaborador: Colaborador) => {
    setSelectedColaborador(colaborador);
    setDetailModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Colaboradores</h1>
          <p className="text-muted-foreground text-sm">Gestão do cadastro de colaboradores</p>
        </div>
        <Button className="gap-2" onClick={handleOpenNewModal}>
          <Plus className="w-4 h-4" />
          Novo Colaborador
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome, matrícula, cargo, departamento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
              {statusOptions.map(status => (
                <SelectItem key={status} value={status}>
                  {status === 'todos' ? 'Todos Status' : statusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Departamento Filter */}
          <Select value={departamentoFilter} onValueChange={setDepartamentoFilter}>
            <SelectTrigger className="w-[160px] bg-card">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
              {departamentos.map(dept => (
                <SelectItem key={dept} value={dept}>
                  {dept === 'todos' ? 'Todos Deptos' : dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Cargo Filter */}
          <Select value={cargoFilter} onValueChange={setCargoFilter}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="Cargo" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
              {cargos.map(cargo => (
                <SelectItem key={cargo} value={cargo}>
                  {cargo === 'todos' ? 'Todos Cargos' : cargo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="gap-1 text-muted-foreground hover:text-foreground">
              <X className="w-3 h-3" />
              Limpar
            </Button>
          )}
        </div>

        {/* Active Filters Badges */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              Filtros ativos:
            </span>
            {statusFilter !== 'todos' && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Status: {statusLabels[statusFilter]}
                <button onClick={() => setStatusFilter('todos')} className="ml-1 hover:bg-muted rounded p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {departamentoFilter !== 'todos' && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Depto: {departamentoFilter}
                <button onClick={() => setDepartamentoFilter('todos')} className="ml-1 hover:bg-muted rounded p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {cargoFilter !== 'todos' && (
              <Badge variant="secondary" className="gap-1 pr-1">
                Cargo: {cargoFilter}
                <button onClick={() => setCargoFilter('todos')} className="ml-1 hover:bg-muted rounded p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredColaboradores.length === colaboradores.length 
            ? `${colaboradores.length} colaboradores`
            : `${filteredColaboradores.length} de ${colaboradores.length} colaboradores`
          }
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th 
                className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => handleSort('nome')}
              >
                <div className="flex items-center gap-1.5">
                  Colaborador
                  <SortIcon column="nome" />
                </div>
              </th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Matrícula</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cargo</th>
              <th 
                className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => handleSort('departamento')}
              >
                <div className="flex items-center gap-1.5">
                  Departamento
                  <SortIcon column="departamento" />
                </div>
              </th>
              <th 
                className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => handleSort('dataAdmissao')}
              >
                <div className="flex items-center gap-1.5">
                  Data Admissão
                  <SortIcon column="dataAdmissao" />
                </div>
              </th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
              <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredColaboradores.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">Nenhum colaborador encontrado</p>
                    {hasActiveFilters && (
                      <Button variant="link" size="sm" onClick={clearAllFilters}>
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredColaboradores.map((colab) => {
                const colors = statusColors[colab.status];
                return (
                  <tr 
                    key={colab.id} 
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(colab)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {colab.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{colab.nome}</p>
                          <p className="text-xs text-muted-foreground">Desde {new Date(colab.dataAdmissao).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-foreground font-mono">{colab.matricula}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-foreground">{colab.cargo}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">{colab.departamento}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {new Date(colab.dataAdmissao).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge className={cn("gap-1.5", colors.bg, colors.text, "border-0")}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", colors.dot)} />
                        {statusLabels[colab.status]}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(colab);
                        }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredColaboradores.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando 1-{filteredColaboradores.length} de {filteredColaboradores.length}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Anterior</Button>
            <Button variant="outline" size="sm" disabled>Próximo</Button>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      <ColaboradorModal 
        colaborador={selectedColaborador}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onEdit={handleOpenEditModal}
      />

      {/* Modal Form (Novo/Editar) */}
      <ColaboradorFormModal 
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        colaborador={editingColaborador}
        onSuccess={handleSaveColaborador}
      />
    </div>
  );
}
