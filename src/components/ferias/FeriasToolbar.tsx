import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, RefreshCw, Calendar } from 'lucide-react';
import { SearchInput } from '@/components/SearchInput';
import { SavedFiltersDropdown } from '@/components/SavedFiltersDropdown';
import { AdvancedFilters, FilterValue, FilterConfig } from '@/components/AdvancedFilters';
import { DataImporter } from '@/components/DataImporter';
import { BulkActionsBar } from '@/components/BulkActionsBar';
import { feriasImportSchema, importTemplates, filterConfigs } from '@/lib/dpSchemas';
import { exportToExcel } from '@/lib/excelImporter';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FeriasToolbarProps {
  onSearch: (term: string) => void;
  onFiltersChange: (filters: FilterValue[]) => void;
  onRefresh: () => void;
  onNewClick: () => void;
  selectedCount: number;
  onClearSelection: () => void;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  currentFilters: Record<string, unknown>;
  data?: unknown[];
}

export const FeriasToolbar = memo(function FeriasToolbar({
  onSearch,
  onFiltersChange,
  onRefresh,
  onNewClick,
  selectedCount,
  onClearSelection,
  onBulkApprove,
  onBulkReject,
  currentFilters,
  data = [],
}: FeriasToolbarProps) {
  const [filterValues, setFilterValues] = useState<FilterValue[]>([]);

  const handleImport = async (ferias: unknown[]) => {
    const { error } = await supabase.from('ferias').insert(ferias);
    if (error) throw error;
    toast.success(`${ferias.length} registros de férias importados!`);
    onRefresh();
  };

  const handleExport = () => {
    if (data.length === 0) {
      toast.warning('Nenhum dado para exportar');
      return;
    }
    const columns = [
      { key: 'colaborador_nome' as const, label: 'Colaborador' },
      { key: 'data_inicio' as const, label: 'Início' },
      { key: 'data_fim' as const, label: 'Fim' },
      { key: 'dias' as const, label: 'Dias' },
      { key: 'status' as const, label: 'Status' },
    ];
    exportToExcel(data as Record<string, unknown>[], columns, 'ferias', 'Férias');
    toast.success('Exportação concluída!');
  };

  const bulkActions = [
    { key: 'approve', label: 'Aprovar', icon: <Calendar className="h-4 w-4" />, onClick: onBulkApprove },
    { key: 'reject', label: 'Rejeitar', icon: <Calendar className="h-4 w-4" />, variant: 'destructive' as const, onClick: onBulkReject },
  ];

  return (
    <div className="space-y-3">
      {selectedCount > 0 && (
        <BulkActionsBar
          selectedCount={selectedCount}
          onClearSelection={onClearSelection}
          actions={bulkActions}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <SearchInput onSearch={onSearch} placeholder="Buscar férias..." className="w-64" />
          <AdvancedFilters
            filters={filterConfigs.ferias as FilterConfig[]}
            values={filterValues}
            onChange={(values) => { setFilterValues(values); onFiltersChange(values); }}
          />
          <SavedFiltersDropdown
            entityType="ferias"
            currentFilters={currentFilters}
            onApplyFilter={(filters) => {
              const values = Object.entries(filters).map(([key, value]) => ({ key, operator: 'eq' as const, value }));
              setFilterValues(values);
              onFiltersChange(values);
            }}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw className="h-4 w-4" /></Button>
          <DataImporter
            schema={feriasImportSchema}
            columns={importTemplates.ferias}
            onImport={handleImport}
            templateName="ferias"
            title="Importar Férias"
            trigger={<Button variant="outline" size="sm" className="gap-2"><Upload className="h-4 w-4" /><span className="hidden sm:inline">Importar</span></Button>}
            onSuccess={onRefresh}
          />
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" /><span className="hidden sm:inline">Exportar</span></Button>
          <Button size="sm" onClick={onNewClick} className="gap-2"><Plus className="h-4 w-4" /><span className="hidden sm:inline">Nova</span></Button>
        </div>
      </div>
    </div>
  );
});

export default FeriasToolbar;
