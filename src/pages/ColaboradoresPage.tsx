import { useState, useMemo } from 'react';
import { PageTitle } from '@/components/PageTitle';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColaboradorStatus } from '@/components/ui/status-badge';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { colaboradorService } from '@/services';
import { Eye, Edit, Users, Download, FileSpreadsheet, FileText, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmpresa } from '@/contexts';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useExcelExport } from '@/hooks/useExcelExport';
import { usePDFExport } from '@/hooks/usePDFExport';
import { useDepartamentos } from '@/hooks/useDepartamentos';
import { useCargos } from '@/hooks/useCargos';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PAGE_SIZE = 25;

export default function ColaboradoresPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptoFilter, setDeptoFilter] = useState('');
  const [cargoFilter, setCargoFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { empresaAtual } = useEmpresa();
  const { departamentos } = useDepartamentos();
  const { cargos } = useCargos();
  const { exportarExcel } = useExcelExport();
  const { exportarPDF } = usePDFExport();

  const { data: colaboradores, isLoading } = useQuery({
    queryKey: ['colaboradores', empresaAtual?.id],
    queryFn: () => colaboradorService.list(empresaAtual?.id),
    enabled: !!empresaAtual?.id,
  });

  // Count by status for filter badges
  const statusCounts = useMemo(() => {
    if (!colaboradores) return {};
    return colaboradores.reduce((acc: Record<string, number>, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {});
  }, [colaboradores]);

  const statusOptions = [
    { value: 'ativo', label: `Ativo (${statusCounts['ativo'] || 0})` },
    { value: 'inativo', label: `Inativo (${statusCounts['inativo'] || 0})` },
    { value: 'ferias', label: `Férias (${statusCounts['ferias'] || 0})` },
    { value: 'afastado', label: `Afastado (${statusCounts['afastado'] || 0})` },
  ];

  const filtered = useMemo(() => {
    return colaboradores?.filter((c) => {
      const matchSearch = !search || 
        c.nome_completo.toLowerCase().includes(search.toLowerCase()) || 
        c.cpf?.includes(search) ||
        c.email?.toLowerCase().includes(search.toLowerCase());
      
      const matchStatus = !statusFilter || statusFilter === 'all' || c.status === statusFilter;
      const matchDepto = !deptoFilter || deptoFilter === 'all' || c.departamento === deptoFilter;
      const matchCargo = !cargoFilter || cargoFilter === 'all' || c.cargo === cargoFilter;
      
      return matchSearch && matchStatus && matchDepto && matchCargo;
    }) || [];
  }, [colaboradores, search, statusFilter, deptoFilter, cargoFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset page when filters change
  const handleSearchChange = (v: string) => { setSearch(v); setCurrentPage(1); };
  const handleStatusChange = (v: string) => { setStatusFilter(v); setCurrentPage(1); };

  const handleExportExcel = () => {
    if (!filtered.length) return;
    exportarExcel(
      'Relatório de Colaboradores',
      filtered,
      ['nome_completo', 'cpf', 'cargo', 'departamento', 'status', 'data_admissao', 'email']
    );
  };

  const handleExportPDF = () => {
    if (!filtered.length) return;
    exportarPDF(
      'Relatório de Colaboradores',
      filtered,
      ['nome_completo', 'cpf', 'cargo', 'departamento', 'status']
    );
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-xl sm:text-display font-display font-bold tracking-tight">Colaboradores</h1>
          <p className="text-body text-muted-foreground font-body mt-1">
            Gestão analítica de {filtered.length} talentos da organização
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 rounded-xl gap-2 px-4 shadow-sm bg-card/50">
                <Download className="h-4 w-4" />
                <span>Exportar Dados</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl w-48">
              <DropdownMenuItem onClick={handleExportExcel} className="gap-2 cursor-pointer py-2.5">
                <FileSpreadsheet className="h-4 w-4 text-success" />
                Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer py-2.5">
                <FileText className="h-4 w-4 text-destructive" />
                PDF (.pdf)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            onClick={() => navigate('/colaboradores/novo')}
            className="h-11 rounded-xl px-6 gap-2 bg-primary text-primary-foreground shadow-glow hover:shadow-glow-lg transition-all"
          >
            <Users className="h-4 w-4" />
            Novo Colaborador
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusOptions.map((opt, i) => {
          const statusKey = opt.value;
          const isActive = statusFilter === statusKey;
          return (
            <motion.button
              key={statusKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleStatusChange(isActive ? '' : statusKey)}
              className={cn(
                "p-4 rounded-2xl border transition-all text-left group",
                isActive 
                  ? "bg-primary/5 border-primary shadow-sm" 
                  : "bg-card/50 border-border/40 hover:border-primary/20 hover:bg-card"
              )}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                {opt.label.split(' (')[0]}
              </p>
              <p className={cn(
                "text-2xl font-display font-bold",
                isActive ? "text-primary" : "text-foreground"
              )}>
                {statusCounts[statusKey] || 0}
              </p>
            </motion.button>
          );
        })}
      </div>

      <DataTableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Pesquisar por nome, CPF, e-mail ou matrícula..."
        filters={[
          { key: 'departamento', label: 'Departamento', options: departamentos.map(d => ({ value: d.nome, label: d.nome })), value: deptoFilter, onChange: (v) => { setDeptoFilter(v); setCurrentPage(1); } },
          { key: 'cargo', label: 'Cargo', options: cargos.map(c => ({ value: c.nome, label: c.nome })), value: cargoFilter, onChange: (v) => { setCargoFilter(v); setCurrentPage(1); } }
        ]}
        onClearFilters={() => {
          setStatusFilter('');
          setDeptoFilter('');
          setCargoFilter('');
          setSearch('');
          setCurrentPage(1);
        }}
      />

      {isLoading ? (
        <div className="rounded-xl border border-border/30 overflow-hidden">
          <div className="p-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24 hidden sm:block" />
                <Skeleton className="h-4 w-28 hidden md:block" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </div>
      ) : !filtered?.length ? (
        <EmptyList entityName="colaborador" onCreate={() => navigate('/colaboradores/novo')} />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border/30 overflow-hidden shadow-elevated">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-display font-semibold">Colaborador</TableHead>
                <TableHead className="font-display font-semibold hidden sm:table-cell">CPF</TableHead>
                <TableHead className="font-display font-semibold hidden md:table-cell">Cargo</TableHead>
                <TableHead className="font-display font-semibold">Status</TableHead>
                <TableHead className="w-[100px] font-display font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((c) => (
                <TableRow
                  key={c.id}
                  className="hover:bg-accent/30 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/colaboradores/${c.id}/editar`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserAvatar name={c.nome_completo} size="sm" />
                      <div>
                        <p className="font-body font-medium text-sm">{c.nome_completo}</p>
                        <p className="text-[11px] text-muted-foreground font-body sm:hidden">{c.cargo}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-body text-muted-foreground hidden sm:table-cell">{c.cpf}</TableCell>
                  <TableCell className="font-body text-muted-foreground hidden md:table-cell">{c.cargo}</TableCell>
                  <TableCell><ColaboradorStatus status={c.status} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-info/10 text-info"
                        onClick={(e) => { e.stopPropagation(); navigate(`/colaboradores/${c.id}/editar`); }}
                        title="Ver Perfil"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-warning/10 text-warning"
                        onClick={(e) => { e.stopPropagation(); navigate(`/documentos?colaborador=${c.id}`); }}
                        title="Documentos"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-primary/10 text-primary"
                        onClick={(e) => { e.stopPropagation(); navigate(`/colaboradores/${c.id}/editar`); }}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </motion.div>
      )}
    </PageLayout>
    </>
  );
}
