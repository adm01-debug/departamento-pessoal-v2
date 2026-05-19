import { PageTitle } from '@/components/PageTitle';
import { useEffect } from 'react';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyList } from '@/components/ui/empty-state';
import { GridCardSkeleton } from '@/components/ui/module-skeleton';
import { Building2, Edit, Users, FilterX, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTodasEmpresas } from '@/hooks/useTodasEmpresas';
import { Spinner } from '@/components/ui/spinner';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { SyncErrorState } from '@/components/ui/sync-error-state';
import { toast } from 'sonner';

export default function EmpresasPage() {
  const navigate = useNavigate();
  const { 
    empresas, 
    total, 
    isLoading, 
    isFetching,
    page,
    setPage,
    pageSize,
    search,
    setSearch
  } = useTodasEmpresas();

  useEffect(() => {
    setPage(1);
  }, [search, setPage]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <PageTitle title="Empresas" description="Gestão de empresas" />
      <PageLayout
        title="Empresas"
        description="Gestão de unidades de negócio e grupos econômicos"
        icon={<Building2 className="h-5 w-5 text-primary-foreground" />}
        gradient="from-primary/80 to-primary"
        actions={
          <Button
            onClick={() => navigate('/empresas/novo')}
            className="rounded-xl bg-gradient-to-r from-primary/80 to-primary hover:opacity-90 shadow-lg font-body"
          >
            Nova Empresa
          </Button>
        }
      >
        <DataTableToolbar 
          search={search} 
          onSearchChange={setSearch} 
          searchPlaceholder="Buscar por razão social, fantasia ou CNPJ..." 
        />

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <GridCardSkeleton key={i} />)}
          </div>
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-muted/10">
            {search ? (
              <>
                <FilterX className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-display font-bold">Nenhuma empresa encontrada</h3>
                <p className="text-muted-foreground mb-6">Tente ajustar seus termos de busca.</p>
                <Button variant="outline" onClick={() => setSearch('')} className="rounded-xl">Limpar Busca</Button>
              </>
            ) : (
              <EmptyList entityName="empresa" onCreate={() => navigate('/empresas/novo')} />
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 relative">
              {isFetching && !isLoading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-2xl">
                  <Spinner size="lg" />
                </div>
              )}
              
              {empresas.map((empresa: any, i: number) => (
                <motion.div
                  key={empresa.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="group border border-border/30 hover:border-border/60 shadow-elevated hover:shadow-glow transition-all duration-300 rounded-2xl overflow-hidden bg-card">
                    <div className="h-[2px] bg-gradient-to-r from-primary/80 to-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/80 to-primary shadow-lg group-hover:scale-110 transition-transform">
                        <Building2 className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-display truncate">{empresa.nome_fantasia || empresa.razao_social}</CardTitle>
                        <p className="text-sm text-muted-foreground font-body">{empresa.cnpj || 'CNPJ não informado'}</p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-body">
                          <Users className="h-4 w-4" />
                          <span>Status: {empresa.ativa !== false ? 'Ativa' : 'Inativa'}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/empresas/editar/${empresa.id}`)} className="rounded-xl hover:bg-primary/10 font-body">
                          <Edit className="h-4 w-4 mr-1" />Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

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
    </>
  );
}
