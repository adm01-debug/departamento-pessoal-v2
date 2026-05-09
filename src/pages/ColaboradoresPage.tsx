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
    <>
    <PageTitle title="Colaboradores" description="Gestão de colaboradores do Departamento Pessoal" />
    <PageLayout
      title="Colaboradores"
      description="Gestão de colaboradores"
      icon={<Users className="h-5 w-5 text-primary-foreground" />}
      gradient="from-primary to-primary-glow"
      actions={
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg font-body hidden sm:flex gap-2"
                disabled={!filtered?.length}
              >
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem onClick={handleExportExcel} className="gap-2 cursor-pointer">
                <FileSpreadsheet className="h-4 w-4 text-success" />
                Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
                <FileText className="h-4 w-4 text-destructive" />
                PDF (.pdf)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => navigate('/colaboradores/novo')}
            className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow font-body"
          >
            Novo Colaborador
          </Button>
        </div>
      }
    >
      <DataTableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Buscar por nome ou CPF..."
        filters={[{ key: 'status', label: 'Status', options: statusOptions, value: statusFilter, onChange: handleStatusChange }]}
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
