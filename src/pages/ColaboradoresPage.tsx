import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { PageTitle } from '@/components/PageTitle';
import { PageLayout } from '@/components/layout';
import { ColaboradorFilters } from '@/components/colaboradores/ColaboradorFilters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColaboradorStatus } from '@/components/ui/status-badge';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { Eye, Edit, Users, Download, FileSpreadsheet, FileText, FilterX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
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
    setCargo
  } = useColaboradores();

  // Resetar página ao mudar filtros
  useEffect(() => {
    setPage(1);
  }, [search, status, departamento, cargo, setPage]);

  // Para o resumo superior, ainda podemos precisar de contagens reais. 
  // Mas como agora é paginado no servidor, as contagens seriam apenas da página atual se usarmos useMemo.
  // O ideal seria uma query de agregação, mas por enquanto vamos manter estático ou simplificar.
  const statusOptions = [
    { value: 'ativo', label: `Ativos` },
    { value: 'inativo', label: `Inativos` },
    { value: 'ferias', label: `Em Férias` },
    { value: 'afastado', label: `Afastados` },
  ];

  const totalPages = Math.ceil(total / pageSize);

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

  const hasActiveFilters = search !== '' || status !== 'all' || departamento !== 'all' || cargo !== 'all';

  return (
    <>
      <PageTitle title="Colaboradores" />
      <PageLayout
        title="Colaboradores"
        description={`Gestão analítica de ${total} talentos da organização`}
        icon={<Users className="h-5 w-5 text-primary-foreground" />}
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
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statusOptions.map((opt, i) => {
              const statusKey = opt.value;
              const isActive = status === statusKey;
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
                    {isActive ? total : '-'}
                  </p>
                </motion.button>
              );
            })}
          </div>

          <ColaboradorFilters
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onDeptoChange={setDepartamento}
            onCargoChange={setCargo}
            departamentos={departamentos}
            cargos={cargos}
            currentFilters={{
              search,
              status,
              departamento,
              cargo
            }}
          />

          {isLoading ? (
            <div className="rounded-2xl border border-border/30 overflow-hidden bg-card/30">
              <div className="p-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-border/10 last:border-0">
                    <Skeleton className="h-11 w-11 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-24 hidden sm:block" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          ) : total === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-muted/10">
              {hasActiveFilters ? (
                <>
                  <FilterX className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-lg font-display font-bold">Nenhum colaborador encontrado</h3>
                  <p className="text-muted-foreground mb-6 text-center max-w-sm">
                    Não encontramos colaboradores com os filtros aplicados.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearch('');
                      setStatus('all');
                      setDepartamento('all');
                      setCargo('all');
                    }} 
                    className="rounded-xl"
                  >
                    Limpar Todos os Filtros
                  </Button>
                </>
              ) : (
                <EmptyList entityName="colaborador" onCreate={() => navigate('/colaboradores/novo')} />
              )}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated bg-card/30 backdrop-blur-sm relative"
            >
              {isFetching && !isLoading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <Spinner size="md" />
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 border-b border-border/20">
                    <TableHead className="font-display font-bold py-4 pl-6 text-foreground">Colaborador</TableHead>
                    <TableHead className="font-display font-bold hidden sm:table-cell text-foreground">Identificação</TableHead>
                    <TableHead className="font-display font-bold hidden md:table-cell text-foreground">Posição</TableHead>
                    <TableHead className="font-display font-bold text-foreground">Status</TableHead>
                    <TableHead className="w-[120px] font-display font-bold pr-6 text-foreground text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {colaboradores.map((c: any) => (
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
                  ))}
                </TableBody>
              </Table>

              <div className="p-4 border-t border-border/10 bg-muted/10">
                <DataTablePagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalItems={total}
                  pageSize={pageSize}
                  onPageChange={setPage}
                />
              </div>
            </motion.div>
          )}
        </div>
      </PageLayout>
    </>
  );
}
