import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ColaboradorFilters } from '@/components/colaboradores/ColaboradorFilters';
import { TableCell, TableRow } from '@/components/ui/table';
import { ColaboradorStatus } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';
import { Eye, Edit, Users, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useExcelExport } from '@/hooks/useExcelExport';
import { usePDFExport } from '@/hooks/usePDFExport';
import { useDepartamentos } from '@/hooks/useDepartamentos';
import { useCargos } from '@/hooks/useCargos';
import { useColaboradores } from '@/hooks/useColaboradores';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EntityPageContainer } from '@/components/layout/EntityPageContainer';
import { Colaborador } from '@/types/entities';
import { StatCardSkeleton } from '@/components/ui/module-skeleton';

export default function ColaboradoresPage() {
  const navigate = useNavigate();
  const { departamentos } = useDepartamentos();
  const { cargos } = useCargos();
  const { exportarExcel } = useExcelExport();
  const { exportarPDF } = usePDFExport();

  const { 
    colaboradores, 
    total,
    isLoading, 
    isFetching,
    error,
    page,
    setPage,
    pageSize,
    search,
    setSearch,
    status,
    setStatus,
    departamento,
    setDepartamento,
    cargo,
    setCargo,
    refetch,
    summary
  } = useColaboradores();

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
  }, [setPage]);

  // Reset page when search or filters change
  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, [setSearch, setPage]);

  const handleStatusChange = useCallback((val: string) => {
    setStatus(val);
    setPage(1);
  }, [setStatus, setPage]);

  const handleDeptoChange = useCallback((val: string) => {
    setDepartamento(val);
    setPage(1);
  }, [setDepartamento, setPage]);

  const handleCargoChange = useCallback((val: string) => {
    setCargo(val);
    setPage(1);
  }, [setCargo, setPage]);

  const statusOptions = [
    { value: 'ativo', label: `Ativos` },
    { value: 'inativo', label: `Inativos` },
    { value: 'ferias', label: `Em Férias` },
    { value: 'afastado', label: `Afastados` },
  ];

  const handleExportExcel = () => {
    if (!colaboradores.length) return;
    exportarExcel(
      'Relatório de Colaboradores',
      colaboradores,
      ['nome_completo', 'cpf', 'cargo', 'departamento', 'status', 'data_admissao', 'email']
    );
  };

  const handleExportPDF = () => {
    if (!colaboradores.length) return;
    exportarPDF(
      'Relatório de Colaboradores',
      colaboradores,
      ['nome_completo', 'cpf', 'cargo', 'departamento', 'status']
    );
  };

  return (
    <EntityPageContainer<Colaborador>
      pageTitle="Colaboradores"
      pageDescription="Gestão de colaboradores"
      title="Colaboradores"
      description={`Gestão analítica de ${total} talentos da organização`}
      icon={<Users className="h-5 w-5 text-primary-foreground" />}
      gradient="from-primary to-primary-glow"
      entityName="colaborador"
      items={colaboradores}
      total={total}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      page={page}
      pageSize={pageSize}
      search={search}
      onPageChange={handlePageChange}
      onSearchChange={handleSearchChange}
      onRefetch={refetch}
      actions={
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
      }
      stats={
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statusOptions.map((opt, i) => {
            const statusKey = opt.value;
            const isActive = status === statusKey;
            const count = summary ? (summary as any)[statusKey] || 0 : '-';
            
            return (
              <motion.button
                key={statusKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setStatus(isActive ? 'all' : statusKey)}
                className={cn(
                  "p-4 rounded-2xl border transition-all text-left group",
                  isActive 
                    ? "bg-primary/5 border-primary shadow-sm" 
                    : "bg-card/50 border-border/40 hover:border-primary/20 hover:bg-card"
                )}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  {opt.label}
                </p>
                <p className={cn(
                  "text-2xl font-display font-bold",
                  isActive ? "text-primary" : "text-foreground"
                )}>
                  {count}
                </p>
              </motion.button>
            );
          })}
        </div>
      }
      customFilters={
        <ColaboradorFilters
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onDeptoChange={handleDeptoChange}
          onCargoChange={handleCargoChange}
          departamentos={departamentos}
          cargos={cargos}
          currentFilters={{
            search,
            status,
            departamento,
            cargo
          }}
        />
      }
      columns={[
        { header: 'Colaborador', className: 'pl-6' },
        { header: 'Identificação', hidden: 'sm' },
        { header: 'Posição', hidden: 'md' },
        { header: 'Status' },
        { header: 'Ações', className: 'pr-6 text-right', width: '120px' }
      ]}
      renderRow={(c) => (
        <TableRow
          key={c.id}
          className="hover:bg-primary/5 border-b border-border/10 last:border-0 transition-colors cursor-pointer group"
          onClick={() => navigate(`/colaboradores/${c.id}/editar`)}
        >
          <TableCell className="py-4 pl-6">
            <div className="flex items-center gap-4">
              <UserAvatar name={c.nome_completo} size="md" className="rounded-xl shadow-sm group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-display font-bold text-base leading-tight group-hover:text-primary transition-colors">{c.nome_completo}</p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">{c.email || 'Sem e-mail cadastrado'}</p>
              </div>
            </div>
          </TableCell>
          <TableCell className="hidden sm:table-cell">
            <div className="flex flex-col">
              <span className="font-body font-medium text-sm">CPF: {c.cpf}</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">MAT: {c.matricula || 'N/A'}</span>
            </div>
          </TableCell>
          <TableCell className="hidden md:table-cell">
            <div className="flex flex-col">
              <span className="font-body font-medium text-sm">{c.cargo}</span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{c.departamento}</span>
            </div>
          </TableCell>
          <TableCell><ColaboradorStatus status={c.status} /></TableCell>
          <TableCell className="pr-6 text-right">
            <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-info/10 text-info"
                onClick={(e) => { e.stopPropagation(); navigate(`/colaboradores/${c.id}/editar`); }}
                title="Ver Perfil"
              >
                <Eye className="h-4.5 w-4.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-primary/10 text-primary"
                onClick={(e) => { e.stopPropagation(); navigate(`/colaboradores/${c.id}/editar`); }}
                title="Editar"
              >
                <Edit className="h-4.5 w-4.5" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      )}
    />
  );
}
