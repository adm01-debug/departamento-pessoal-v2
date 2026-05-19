import { PageTitle } from '@/components/PageTitle';
import { useState, useEffect } from 'react';
import { useCargos } from '@/hooks/useCargos';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus, Search, Info, FilterX, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { SyncErrorState } from '@/components/ui/sync-error-state';
import { toast } from 'sonner';

export default function CargosPage() {
  const { 
    cargos, 
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
  } = useCargos();

  // Actually, looking at my previous hook update for useCargos, it doesn't take params yet for page/pageSize in the returned object if I didn't change the state.
  // Let me re-verify useCargos.ts
  
  // Resetar página ao buscar
  useEffect(() => {
    setPage(1);
  }, [search, setPage]);

  const formatCurrency = (v: number | null) => (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <PageTitle title="Gestão de Cargos" description="Definição de funções e faixas salariais" />
      <PageLayout
        title="Cargos"
        description="Gestão de estratégia de cargos, CBO e remuneração sincronizada"
        icon={<Briefcase className="h-5 w-5 text-primary-foreground" />}
        gradient="from-warning to-info"
        actions={
          <Button className="rounded-xl bg-gradient-to-r from-warning to-info hover:opacity-90 shadow-lg font-bold">
            <Plus className="h-4 w-4 mr-2" />Novo Cargo
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <Card className="border-border/30 rounded-2xl bg-card/50 shadow-sm"><CardContent className="p-4">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total Cargos</p>
            <h3 className="text-2xl font-display font-bold">{total}</h3>
          </CardContent></Card>
        </div>

        <DataTableToolbar 
          search={search} 
          onSearchChange={setSearch} 
          searchPlaceholder="Buscar por nome ou CBO..." 
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-4">
            <Spinner size="lg" />
            <p className="text-sm text-muted-foreground animate-pulse">Carregando cargos...</p>
          </div>
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-muted/10">
            {search ? (
              <>
                <FilterX className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-display font-bold">Nenhum cargo encontrado</h3>
                <p className="text-muted-foreground mb-6">Tente ajustar seus termos de busca.</p>
                <Button variant="outline" onClick={() => setSearch('')} className="rounded-xl">Limpar Busca</Button>
              </>
            ) : (
              <EmptyList entityName="cargo" />
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
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/20">
                    <TableHead className="font-display font-semibold py-4 pl-6">Cargo</TableHead>
                    <TableHead className="font-display font-semibold">CBO</TableHead>
                    <TableHead className="font-display font-semibold">Nível</TableHead>
                    <TableHead className="font-display font-semibold text-right">Salário Base</TableHead>
                    <TableHead className="font-display font-semibold">Status</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cargos.map((cargo: any) => (
                    <TableRow key={cargo.id} className="hover:bg-accent/20 transition-colors group border-b border-border/10 last:border-0">
                      <TableCell className="py-4 pl-6">
                        <div className="flex flex-col">
                          <span className="font-body font-bold text-sm text-foreground">{cargo.nome}</span>
                          {cargo.descricao && <span className="text-[10px] text-muted-foreground truncate max-w-[250px]">{cargo.descricao}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-[11px] font-medium">{cargo.cbo || 'Não inf.'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-bold border-border/50 bg-muted/30">Lvl {cargo.nivel_hierarquico || 1}</Badge>
                      </TableCell>
                      <TableCell className="font-body text-right text-sm font-bold text-success">
                        {cargo.salario_base ? formatCurrency(cargo.salario_base) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={cargo.ativo !== false ? 'bg-success/10 text-success border-0 text-[10px]' : 'bg-muted text-muted-foreground border-0 text-[10px]'}>
                          {cargo.ativo !== false ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Info className="h-4 w-4" />
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
    </>
  );
}
