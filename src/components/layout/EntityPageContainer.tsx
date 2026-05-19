import React, { ReactNode } from 'react';
import { PageTitle } from '@/components/PageTitle';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { FilterX } from 'lucide-react';
import { motion } from 'framer-motion';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { SyncErrorState } from '@/components/ui/sync-error-state';
import { Button } from '@/components/ui/button';

interface EntityPageContainerProps<T> {
  title: string;
  description: string;
  pageTitle: string;
  pageDescription: string;
  icon: ReactNode;
  gradient: string;
  actions?: ReactNode;
  
  // Query State
  items: T[];
  total: number;
  isLoading: boolean;
  isFetching: boolean;
  error: any;
  page: number;
  pageSize: number;
  search: string;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onRefetch: () => void;
  
  // Customization
  searchPlaceholder?: string;
  entityName: string; // e.g., "cargo", "departamento"
  columns: { header: string; className?: string; width?: string; hidden?: 'sm' | 'md' | 'lg' | boolean }[];
  renderRow: (item: T) => ReactNode;
  stats?: ReactNode;
  customFilters?: ReactNode;
}


export function EntityPageContainer<T extends { id: string | number }>({
  title,
  description,
  pageTitle,
  pageDescription,
  icon,
  gradient,
  actions,
  items,
  total,
  isLoading,
  isFetching,
  error,
  page,
  pageSize,
  search,
  onPageChange,
  onSearchChange,
  onRefetch,
  searchPlaceholder,
  entityName,
  columns,
  renderRow,
  stats
}: EntityPageContainerProps<T>) {
  const totalPages = Math.ceil(total / pageSize);
  const hasFilters = search !== '';

  return (
    <>
      <PageTitle title={pageTitle} description={pageDescription} />
      <PageLayout
        title={title}
        description={description}
        icon={icon}
        gradient={gradient}
        actions={actions}
      >
        {stats}

        {customFilters || (
          <DataTableToolbar 
            search={search} 
            onSearchChange={onSearchChange} 
            searchPlaceholder={searchPlaceholder || `Buscar por nome...`} 
          />
        )}


        {error ? (
          <SyncErrorState error={error} onRetry={onRefetch} entityName={entityName + 's'} />
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-4">
            <Spinner size="lg" />
            <p className="text-sm text-muted-foreground animate-pulse">Carregando {entityName}s...</p>
          </div>
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-muted/10">
            {hasFilters ? (
              <>
                <FilterX className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-display font-bold">Nenhum {entityName} encontrado</h3>
                <p className="text-muted-foreground mb-6">Tente ajustar seus termos de busca.</p>
                <Button variant="outline" onClick={() => onSearchChange('')} className="rounded-xl">Limpar Busca</Button>
              </>
            ) : (
              <EmptyList entityName={entityName} />
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
                    {columns.map((col, idx) => (
                      <TableHead key={idx} className={`font-display font-semibold py-4 ${col.className || ''}`} style={{ width: col.width }}>
                        {col.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(renderRow)}
                </TableBody>
              </Table>
            </motion.div>

            <DataTablePagination 
              currentPage={page}
              totalPages={totalPages}
              totalItems={total}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </PageLayout>
    </>
  );
}
