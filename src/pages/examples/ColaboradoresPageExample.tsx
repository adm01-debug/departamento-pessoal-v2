/**
 * EXEMPLO: Página de Colaboradores com CRUD Completo
 * 
 * Este arquivo demonstra como usar todos os componentes e hooks
 * do toolkit CRUD para criar uma página de listagem completa.
 * 
 * Funcionalidades implementadas:
 * - Busca fulltext
 * - Filtros avançados e salvos
 * - Import CSV/Excel
 * - Export Excel
 * - Bulk actions (seleção múltipla)
 * - Paginação
 * - Soft delete
 * - Duplicação
 * 
 * Use este arquivo como referência para implementar em outras páginas.
 */

import { useState, useCallback, useMemo } from 'react';
import { Users, Plus } from 'lucide-react';
import { useCRUD } from '@/hooks/useCRUD';
import { useBulkActions } from '@/hooks/useBulkActions';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useSavedFilters } from '@/hooks/useSavedFilters';
import { ColaboradoresToolbar } from '@/components/colaboradores/ColaboradoresToolbar';
import { EntityListWrapper } from '@/components/EntityListWrapper';
import { DataTableSelectable, Column } from '@/components/DataTableSelectable';
import { EmptyState } from '@/components/EmptyState';
import { DuplicateButton } from '@/components/DuplicateButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Colaborador } from '@/hooks/dp-types';
import { FilterValue } from '@/components/AdvancedFilters';

export default function ColaboradoresPageExample() {
  // Estados
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterValue[]>([]);

  // Debounce da busca
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  // Converte FilterValue[] para Record<string, unknown>
  const filterRecord = useMemo(() => {
    return filters.reduce((acc, f) => {
      acc[f.key] = f.value;
      return acc;
    }, {} as Record<string, unknown>);
  }, [filters]);

  // Hook CRUD genérico
  const colaboradoresCRUD = useCRUD<Colaborador>({
    tableName: 'colaboradores',
    orderBy: { column: 'nome', ascending: true },
    messages: {
      createSuccess: 'Colaborador cadastrado!',
      updateSuccess: 'Colaborador atualizado!',
      deleteSuccess: 'Colaborador removido!',
    },
  });

  // Query de listagem
  const { data: listResult, isLoading, refetch } = colaboradoresCRUD.useList({
    search: debouncedSearch,
    searchColumns: ['nome', 'cpf', 'email'],
    filters: filterRecord,
    page,
    pageSize,
  });

  // Bulk actions
  const bulk = useBulkActions(listResult?.data || [], {
    tableName: 'colaboradores',
    onActionComplete: refetch,
  });

  // Handlers
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterValue[]) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleBulkDelete = useCallback(() => {
    if (confirm(`Excluir ${bulk.selectedCount} colaboradores?`)) {
      bulk.executeAction({
        key: 'delete',
        label: 'Excluir',
        handler: async (ids) => {
          await colaboradoresCRUD.bulkDelete(ids);
        },
      });
    }
  }, [bulk, colaboradoresCRUD]);

  const handleBulkArchive = useCallback(() => {
    bulk.executeAction({
      key: 'archive',
      label: 'Arquivar',
      handler: async (ids) => {
        // Implementar soft delete em lote
      },
    });
  }, [bulk]);

  // Colunas da tabela
  const columns: Column<Colaborador>[] = useMemo(() => [
    { key: 'nome', label: 'Nome' },
    { key: 'cpf', label: 'CPF' },
    { key: 'email', label: 'E-mail' },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <Badge variant={item.status === 'ativo' ? 'default' : 'secondary'}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'w-20',
      render: (item) => (
        <DuplicateButton
          record={item}
          tableName="colaboradores"
          nameField="nome"
          invalidateQueries={[['colaboradores']]}
          variant="ghost"
          size="icon"
        />
      ),
    },
  ], []);

  return (
    <div className="container mx-auto py-6">
      <EntityListWrapper
        title="Colaboradores"
        icon={<Users className="h-5 w-5" />}
        data={listResult?.data || []}
        isLoading={isLoading}
        total={listResult?.total || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRefresh={refetch}
        toolbar={
          <ColaboradoresToolbar
            onSearch={handleSearch}
            onFiltersChange={handleFiltersChange}
            onRefresh={refetch}
            onNewClick={() => {/* abrir modal/drawer */}}
            selectedCount={bulk.selectedCount}
            selectedItems={bulk.selectedItems}
            onClearSelection={bulk.clearSelection}
            onBulkDelete={handleBulkDelete}
            onBulkArchive={handleBulkArchive}
            currentFilters={filterRecord}
            data={listResult?.data}
          />
        }
        emptyState={
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title="Nenhum colaborador cadastrado"
            description="Comece cadastrando seu primeiro colaborador ou importe de uma planilha."
            action={{
              label: 'Novo Colaborador',
              onClick: () => {/* abrir modal */},
            }}
          />
        }
      >
        {({ items, selectedIds, toggleSelect, toggleAll, isAllSelected }) => (
          <DataTableSelectable
            data={items}
            columns={columns}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleAll={toggleAll}
            isAllSelected={isAllSelected}
            onRowClick={(item) => {/* abrir detalhes */}}
          />
        )}
      </EntityListWrapper>
    </div>
  );
}
