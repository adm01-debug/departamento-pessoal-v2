import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, RefreshCw } from 'lucide-react';
import { SearchInput } from '@/components/SearchInput';
import { SavedFiltersDropdown } from '@/components/SavedFiltersDropdown';
import { AdvancedFilters, FilterValue, FilterConfig } from '@/components/AdvancedFilters';
import { DataImporter } from '@/components/DataImporter';
import { BulkActionsBar, defaultBulkActions } from '@/components/BulkActionsBar';
import { colaboradorImportSchema, importTemplates, filterConfigs } from '@/lib/dpSchemas';
import { exportToExcel } from '@/lib/excelImporter';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ColaboradoresToolbarProps {
  onSearch: (term: string) => void;
  onFiltersChange: (filters: FilterValue[]) => void;
  onRefresh: () => void;
  onNewClick: () => void;
  selectedCount: number;
  selectedItems: { id: string }[];
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkArchive: () => void;
  currentFilters: Record<string, unknown>;
  data?: unknown[];
}

export const ColaboradoresToolbar = memo(function ColaboradoresToolbar({
  onSearch,
  onFiltersChange,
  onRefresh,
  onNewClick,
  selectedCount,
  selectedItems,
  onClearSelection,
  onBulkDelete,
  onBulkArchive,
  currentFilters,
  data = [],
}: ColaboradoresToolbarProps) {
  const [filterValues, setFilterValues] = useState<FilterValue[]>([]);

  const handleImport = async (colaboradores: unknown[]) => {
    const { error } = await supabase
      .from('colaboradores')
      .insert(colaboradores);

    if (error) throw error;
    toast.success(`${colaboradores.length} colaboradores importados!`);
    onRefresh();
  };

  const handleExport = () => {
    if (data.length === 0) {
      toast.warning('Nenhum dado para exportar');
      return;
    }

    const columns = [
      { key: 'nome' as const, label: 'Nome' },
      { key: 'cpf' as const, label: 'CPF' },
      { key: 'email' as const, label: 'E-mail' },
      { key: 'telefone' as const, label: 'Telefone' },
      { key: 'cargo' as const, label: 'Cargo' },
      { key: 'departamento' as const, label: 'Departamento' },
      { key: 'status' as const, label: 'Status' },
    ];

    exportToExcel(data as Record<string, unknown>[], columns, 'colaboradores', 'Colaboradores');
    toast.success('Exportação concluída!');
  };

  const bulkActions = [
    defaultBulkActions.archive(onBulkArchive),
    defaultBulkActions.delete(onBulkDelete),
  ];

  return (
    <div className="space-y-3">
      {/* Barra de ações em lote */}
      {selectedCount > 0 && (
        <BulkActionsBar
          selectedCount={selectedCount}
          onClearSelection={onClearSelection}
          actions={bulkActions}
        />
      )}

      {/* Toolbar principal */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <SearchInput
            onSearch={onSearch}
            placeholder="Buscar colaborador..."
            className="w-64"
          />
          
          <AdvancedFilters
            filters={filterConfigs.colaboradores as FilterConfig[]}
            values={filterValues}
            onChange={(values) => {
              setFilterValues(values);
              onFiltersChange(values);
            }}
          />

          <SavedFiltersDropdown
            entityType="colaboradores"
            currentFilters={currentFilters}
            onApplyFilter={(filters) => {
              const values = Object.entries(filters).map(([key, value]) => ({
                key,
                operator: 'eq' as const,
                value,
              }));
              setFilterValues(values);
              onFiltersChange(values);
            }}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>

          <DataImporter
            schema={colaboradorImportSchema}
            columns={importTemplates.colaboradores}
            onImport={handleImport}
            templateName="colaboradores"
            title="Importar Colaboradores"
            description="Importe colaboradores de um arquivo CSV ou Excel"
            trigger={
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Importar</span>
              </Button>
            }
            onSuccess={onRefresh}
          />

          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>

          <Button size="sm" onClick={onNewClick} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Novo</span>
          </Button>
        </div>
      </div>
    </div>
  );
});

export default ColaboradoresToolbar;
