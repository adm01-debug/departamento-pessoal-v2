import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useMemo, useEffect, useCallback } from 'react';
import { Search, Plus, MoreVertical, X, SlidersHorizontal, ArrowUpDown, ArrowUp, ArrowDown, Pencil, ChevronLeft, ChevronRight, Loader2, Database, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ColaboradorFormCompleto, ColaboradorFormData } from '@/components/colaboradores/ColaboradorFormCompleto';
import { ExportDropdown } from '@/components/ExportDropdown';
import { ImportacaoColaboradoresModal } from '@/components/colaboradores/ImportacaoColaboradoresModal';
import { useColaboradores } from '@/hooks/useColaboradores';
import { ColaboradorDB, statusColaboradorLabels } from '@/types/colaborador';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { unmask } from '@/lib/masks';
import { formatters, ExportColumn } from '@/lib/exportUtils';

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  ativo: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
  ferias: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
  afastado: { bg: 'bg-loggi/10', text: 'text-loggi', dot: 'bg-loggi' },
  desligado: { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground' },
  pendente: { bg: 'bg-info/10', text: 'text-info', dot: 'bg-info' },
};

type SortColumn = 'nome' | 'dataAdmissao' | 'departamento' | null;
type SortDirection = 'asc' | 'desc';

const Colaboradores = memo(function Colaboradores() {
  useEffect(() => {
    document.title = 'Colaboradores | DP System';
  }, []);

  const { colaboradores, loading, error, createColaborador, updateColaborador, deleteColaborador, fetchColaboradores } = useColaboradores();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [departamentoFilter, setDepartamentoFilter] = useState('todos');
  const [cargoFilter, setCargoFilter] = useState('todos');
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Modal state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState<ColaboradorDB | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [colaboradorToDelete, setColaboradorToDelete] = useState<ColaboradorDB | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Extrair valores únicos para os filtros
  const departamentos = useMemo(() => {
    const unique = [...new Set(colaboradores.map(c => c.departamento))];
    return ['todos', ...unique.sort()];
  }, [colaboradores]);

  const cargos = useMemo(() => {
    const unique = [...new Set(colaboradores.map(c => c.cargo))];
    return ['todos', ...unique.sort()];
  }, [colaboradores]);

  const statusOptions = ['todos', 'ativo', 'ferias', 'afastado', 'desligado', 'pendente'];

  // Handler para criar/editar colaborador
  const handleSaveColaborador = async (data: ColaboradorFormData, isEdit: boolean) => {
    try {
      const colaboradorData = {
        nome_completo: data.nome_completo,
        nome_social: data.nome_social || null,
        cpf: unmask(data.cpf),
        rg: data.rg || null,
        rg_orgao_emissor: data.rg_orgao_emissor || null,
        rg_uf: data.rg_uf || null,
        rg_data_emissao: data.rg_data_emissao || null,
        data_nascimento: data.data_nascimento,
        sexo: data.sexo,
        estado_civil: data.estado_civil,
        nacionalidade: data.nacionalidade || null,
        naturalidade_cidade: data.naturalidade_cidade || null,
        naturalidade_uf: data.naturalidade_uf || null,
        nome_mae: data.nome_mae,
        nome_pai: data.nome_pai || null,
        pis_pasep: data.pis_pasep || null,
        ctps_numero: data.ctps_numero || null,
        ctps_serie: data.ctps_serie || null,
        ctps_uf: data.ctps_uf || null,
        ctps_data_emissao: data.ctps_data_emissao || null,
        titulo_eleitor: data.titulo_eleitor || null,
        titulo_zona: data.titulo_zona || null,
        titulo_secao: data.titulo_secao || null,
        certificado_reservista: data.certificado_reservista || null,
        cnh_numero: data.cnh_numero || null,
        cnh_categoria: data.cnh_categoria || null,
        cnh_validade: data.cnh_validade || null,
        email: data.email || null,
        telefone: data.telefone || null,
        celular: data.celular || null,
        cep: data.cep || null,
        logradouro: data.logradouro || null,
        numero: data.numero || null,
        complemento: data.complemento || null,
        bairro: data.bairro || null,
        cidade: data.cidade || null,
        uf: data.uf || null,
        banco_codigo: data.banco_codigo || null,
        banco_nome: data.banco_nome || null,
        agencia: data.agencia || null,
        conta: data.conta || null,
        tipo_conta: data.tipo_conta || null,
        pix_tipo: data.pix_tipo || null,
        pix_chave: data.pix_chave || null,
        matricula: data.matricula || null,
        data_admissao: data.data_admissao,
        data_desligamento: data.data_desligamento || null,
        tipo_contrato: data.tipo_contrato,
        cargo: data.cargo,
        departamento: data.departamento,
        centro_custo: data.centro_custo || null,
        local_trabalho: data.local_trabalho || null,
        cbo: data.cbo || null,
        salario_base: parseFloat(data.salario_base),
        tipo_salario: data.tipo_salario || null,
        jornada_semanal: data.jornada_semanal ? parseInt(data.jornada_semanal) : null,
        horario_entrada: data.horario_entrada || null,
        horario_saida: data.horario_saida || null,
        intervalo_minutos: data.intervalo_minutos ? parseInt(data.intervalo_minutos) : null,
        escolaridade: data.escolaridade || null,
        formacao: data.formacao || null,
        cursos_certificacoes: data.cursos_certificacoes || null,
        status: data.status,
        observacoes: data.observacoes || null,
      };

      if (isEdit && editingColaborador) {
        await updateColaborador(editingColaborador.id, colaboradorData);
      } else {
        await createColaborador(colaboradorData as unknown);
      }
      setEditingColaborador(null);
    } catch (err) {
      // Error already handled in hook
    }
  };

  // Abrir modal para novo colaborador
  const handleOpenNewModal = () => {
    setEditingColaborador(null);
    setFormModalOpen(true);
  };

  // Abrir modal para editar colaborador
  const handleOpenEditModal = (colaborador: ColaboradorDB) => {
    setEditingColaborador(colaborador);
    setFormModalOpen(true);
  };

  // Abrir confirmação de exclusão
  const handleOpenDeleteConfirm = (colaborador: ColaboradorDB, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setColaboradorToDelete(colaborador);
    setDeleteConfirmOpen(true);
  };

  // Confirmar exclusão
  const handleConfirmDelete = async () => {
    if (colaboradorToDelete) {
      setIsDeleting(true);
      try {
        await deleteColaborador(colaboradorToDelete.id);
        setColaboradorToDelete(null);
        setDeleteConfirmOpen(false);
      } catch (err) {
        // Error already handled in hook
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Filtrar e ordenar colaboradores
  const filteredColaboradores = useMemo(() => {
    let result = colaboradores.filter(c => {
      const matchSearch = search === '' || 
        c.nome_completo.toLowerCase().includes(search.toLowerCase()) ||
        (c.matricula?.toLowerCase().includes(search.toLowerCase())) ||
        c.cargo.toLowerCase().includes(search.toLowerCase()) ||
        c.departamento.toLowerCase().includes(search.toLowerCase()) ||
        c.cpf.includes(unmask(search));
      
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
          comparison = a.nome_completo.localeCompare(b.nome_completo, 'pt-BR');
        } else if (sortColumn === 'dataAdmissao') {
          comparison = new Date(a.data_admissao).getTime() - new Date(b.data_admissao).getTime();
        } else if (sortColumn === 'departamento') {
          comparison = a.departamento.localeCompare(b.departamento, 'pt-BR');
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [colaboradores, search, statusFilter, departamentoFilter, cargoFilter, sortColumn, sortDirection]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, departamentoFilter, cargoFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredColaboradores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedColaboradores = filteredColaboradores.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

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

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  if (loading) {
    return (
      <>
        <SEOHead title="Colaboradores | DP System" description="Gestão de colaboradores" />
        <div id="main-content" className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Carregando colaboradores...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Colaboradores | DP System" description="Gestão de colaboradores" />
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Colaboradores</h1>
          <p className="text-muted-foreground text-sm">Gestão completa do cadastro de colaboradores</p>
        </div>
        <div className="flex gap-2">
          <ExportDropdown
            defaultFilename="colaboradores"
            options={{
              title: 'Relatório de Colaboradores',
              subtitle: `Total: ${filteredColaboradores.length} colaboradores`,
              columns: [
                { key: 'nome_completo', header: 'Nome', width: 30 },
                { key: 'cpf', header: 'CPF', width: 15, format: formatters.cpf },
                { key: 'cargo', header: 'Cargo', width: 20 },
                { key: 'departamento', header: 'Departamento', width: 20 },
                { key: 'data_admissao', header: 'Admissão', width: 12, format: formatters.date },
                { key: 'salario_base', header: 'Salário', width: 15, format: formatters.currency },
                { key: 'status', header: 'Status', width: 12, format: formatters.status },
                { key: 'email', header: 'E-mail', width: 25 },
                { key: 'celular', header: 'Celular', width: 15, format: formatters.phone },
              ] as ExportColumn[],
              data: filteredColaboradores as unknown as Record<string, unknown>[],
            }}
            disabled={filteredColaboradores.length === 0}
          />
          <Button aria-label="Ação" variant="outline" className="gap-2" onClick={() => setImportModalOpen(true)}>
            <Upload className="w-4 h-4" />
            Importar
          </Button>
          <Button className="gap-2" onClick={handleOpenNewModal}>
            <Plus className="w-4 h-4" />
            Novo Colaborador
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome, matrícula, cargo, CPF..." aria-label="Buscar por nome, matrícula, cargo, CPF..."
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
                  {status === 'todos' ? 'Todos Status' : statusColaboradorLabels[status as keyof typeof statusColaboradorLabels]}
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
            <Button aria-label="Ação" variant="ghost" size="sm" onClick={clearAllFilters} className="gap-1 text-muted-foreground hover:text-foreground">
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
                Status: {statusColaboradorLabels[statusFilter as keyof typeof statusColaboradorLabels]}
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
            {colaboradores.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <Database className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Nenhum colaborador cadastrado</p>
                      <p className="text-sm text-muted-foreground mt-1">Comece adicionando o primeiro colaborador</p>
                    </div>
                    <Button aria-label="Ação" onClick={handleOpenNewModal} className="mt-2 gap-2">
                      <Plus className="w-4 h-4" />
                      Novo Colaborador
                    </Button>
                  </div>
                </td>
              </tr>
            ) : filteredColaboradores.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">Nenhum colaborador encontrado</p>
                    {hasActiveFilters && (
                      <Button aria-label="Ação" variant="link" size="sm" onClick={clearAllFilters}>
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedColaboradores.map((colab) => {
                const colors = statusColors[colab.status] || statusColors.pendente;
                return (
                  <tr 
                    key={colab.id} 
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => handleOpenEditModal(colab)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {getInitials(colab.nome_completo)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{colab.nome_completo}</p>
                          <p className="text-xs text-muted-foreground">Desde {new Date(colab.data_admissao).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-foreground font-mono">{colab.matricula || '-'}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-foreground">{colab.cargo}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">{colab.departamento}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {new Date(colab.data_admissao).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge className={cn("gap-1.5", colors.bg, colors.text, "border-0")}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", colors.dot)} />
                        {statusColaboradorLabels[colab.status]}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(colab);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => handleOpenDeleteConfirm(colab, e)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1}-{Math.min(endIndex, filteredColaboradores.length)} de {filteredColaboradores.length}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Itens por página:</span>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-[70px] h-8 bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  {ITEMS_PER_PAGE_OPTIONS.map(option => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="gap-1"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal Form Completo (Novo/Editar) */}
      <ColaboradorFormCompleto 
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        colaborador={editingColaborador}
        onSuccess={handleSaveColaborador}
      />

      {/* Confirmação de Exclusão */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{colaboradorToDelete?.nome_completo}</strong>? 
              Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Importação */}
      <ImportacaoColaboradoresModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onSuccess={() => fetchColaboradores()}
      />
    </div>
    </>
    </>
  );
}
