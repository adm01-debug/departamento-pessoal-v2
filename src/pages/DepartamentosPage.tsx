import { PageTitle } from '@/components/PageTitle';
import { useState, useEffect } from 'react';
import { useDepartamentos } from '@/hooks/useDepartamentos';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Plus, GitBranch, ArrowRight, Wallet, FilterX, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { NovoDepartamentoDialog } from '@/components/departamentos/NovoDepartamentoDialog';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { SyncErrorState } from '@/components/ui/sync-error-state';
import { toast } from 'sonner';

export default function DepartamentosPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<any>(null);
  const { 
    departamentos, 
    total, 
    isLoading, 
    isFetching,
    error,
    page, 
    setPage, 
    pageSize, 
    search, 
    setSearch,
    refetch
  } = useDepartamentos();
  const navigate = useNavigate();

  const totalPages = Math.ceil(total / pageSize);

  const abrirNovo = () => { setEditando(null); setDialogOpen(true); };
  const abrirEditar = (d: any) => { setEditando(d); setDialogOpen(true); };

  // Efeito para resetar a página ao buscar
  useEffect(() => {
    setPage(1);
  }, [search, setPage]);

  useEffect(() => {
    if (error) {
      toast.error("Falha na sincronização de departamentos");
    }
  }, [error]);

  const hasFilters = search !== '';

  return (
    <>
      <PageTitle title="Unidades & Departamentos" description="Gestão da estrutura organizacional" />
      <PageLayout
        title="Departamentos"
        description="Gestão de unidades de negócio e centros de custo sincronizados"
        icon={<Building2 className="h-5 w-5 text-primary-foreground" />}
        gradient="from-info to-primary"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => navigate('/organograma')}>
              <GitBranch className="h-4 w-4 mr-2" />Ver Organograma
            </Button>
            <Button onClick={abrirNovo} className="rounded-xl bg-gradient-to-r from-info to-primary hover:opacity-90 shadow-lg font-bold">
              <Plus className="h-4 w-4 mr-2" />Novo Departamento
            </Button>
          </div>
        }
      >
        <DataTableToolbar 
          search={search} 
          onSearchChange={setSearch} 
          searchPlaceholder="Buscar departamento por nome..." 
        />

        {error ? (
          <SyncErrorState error={error} onRetry={refetch} entityName="departamentos" />
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-4">
            <Spinner size="lg" />
            <p className="text-sm text-muted-foreground animate-pulse">Carregando departamentos...</p>
          </div>
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-muted/10">
            {hasFilters ? (
              <>
                <FilterX className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-display font-bold">Nenhum resultado encontrado</h3>
                <p className="text-muted-foreground mb-6">Tente ajustar seus filtros de busca.</p>
                <Button variant="outline" onClick={() => setSearch('')} className="rounded-xl">Limpar Busca</Button>
              </>
            ) : (
              <EmptyList entityName="departamento" />
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated bg-card relative"
            >
              {isFetching && !isLoading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <Spinner size="md" />
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-display font-semibold">Departamento</TableHead>
                    <TableHead className="font-display font-semibold">C. Custo</TableHead>
                    <TableHead className="font-display font-semibold">Estrutura</TableHead>
                    <TableHead className="font-display font-semibold">Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departamentos.map((dept: any) => (
                    <TableRow key={dept.id} className="hover:bg-accent/20 transition-colors group">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-body font-bold text-sm text-foreground">{dept.nome}</span>
                          {dept.id && (
                            <span className="text-[9px] text-muted-foreground uppercase font-mono tracking-tighter opacity-50">
                              ID: {dept.id.slice(0,8)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-muted-foreground bg-muted/40 px-2 py-1 rounded-lg w-fit">
                          <Wallet className="h-3 w-3" />
                          {dept.codigo_centro_custo || 'GERAL'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {dept.departamento_pai_id ? (
                          <div className="flex items-center gap-1 text-[10px] text-info font-bold">
                            <GitBranch className="h-3 w-3" /> SUB-DEPTO
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] text-success font-bold">
                            <Building2 className="h-3 w-3" /> UNIDADE RAIZ
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={dept.ativo !== false ? 'bg-success/10 text-success border-0 text-[10px]' : 'bg-muted text-muted-foreground border-0 text-[10px]'}>
                          {dept.ativo !== false ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          onClick={() => abrirEditar(dept)} 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-[10px] font-bold gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          DETALHES <ArrowRight className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>

            <DataTablePagination 
              currentPage={page}
              totalPages={totalPages}
              totalItems={total}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </div>
        )}
      </PageLayout>
      <NovoDepartamentoDialog open={dialogOpen} onOpenChange={setDialogOpen} departamento={editando} />
    </>
  );
}
