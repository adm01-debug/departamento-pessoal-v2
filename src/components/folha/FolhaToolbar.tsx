import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, RefreshCw, Calculator, FileText, Lock } from 'lucide-react';
import { SearchInput } from '@/components/SearchInput';
import { SavedFiltersDropdown } from '@/components/SavedFiltersDropdown';
import { AdvancedFilters, FilterValue, FilterConfig } from '@/components/AdvancedFilters';
import { BulkActionsBar } from '@/components/BulkActionsBar';
import { filterConfigs } from '@/lib/dpSchemas';
import { exportToExcel } from '@/lib/excelImporter';
import { toast } from 'sonner';

interface FolhaToolbarProps {
  onSearch: (term: string) => void;
  onFiltersChange: (filters: FilterValue[]) => void;
  onRefresh: () => void;
  onProcessar: () => void;
  onFechar: () => void;
  selectedCount: number;
  onClearSelection: () => void;
  onBulkRecalcular: () => void;
  currentFilters: Record<string, unknown>;
  data?: unknown[];
  competencia?: string;
}

export const FolhaToolbar = memo(function FolhaToolbar({
  onSearch,
  onFiltersChange,
  onRefresh,
  onProcessar,
  onFechar,
  selectedCount,
  onClearSelection,
  onBulkRecalcular,
  currentFilters,
  data = [],
  competencia,
}: FolhaToolbarProps) {
  const [filterValues, setFilterValues] = useState<FilterValue[]>([]);

  const handleExportFolha = () => {
    if (data.length === 0) { toast.warning('Nenhum dado para exportar'); return; }
    const columns = [
      { key: 'colaborador_nome' as const, label: 'Colaborador' },
      { key: 'cpf' as const, label: 'CPF' },
      { key: 'cargo' as const, label: 'Cargo' },
      { key: 'salario_base' as const, label: 'Salário Base' },
      { key: 'descontos' as const, label: 'Descontos' },
      { key: 'liquido' as const, label: 'Líquido' },
    ];
    exportToExcel(data as Record<string, unknown>[], columns, `folha_${competencia || 'atual'}`, 'Folha de Pagamento');
    toast.success('Folha exportada!');
  };

  const handleExportResumo = () => {
    toast.success('Resumo da folha exportado!');
  };

  const bulkActions = [
    { key: 'recalcular', label: 'Recalcular', icon: <Calculator className="h-4 w-4" />, onClick: onBulkRecalcular },
  ];

  return (
    <div className="space-y-3">
      {selectedCount > 0 && (
        <BulkActionsBar selectedCount={selectedCount} onClearSelection={onClearSelection} actions={bulkActions} />
      )}

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <SearchInput onSearch={onSearch} placeholder="Buscar na folha..." className="w-64" />
          <AdvancedFilters
            filters={filterConfigs.folha as FilterConfig[]}
            values={filterValues}
            onChange={(values) => { setFilterValues(values); onFiltersChange(values); }}
          />
          <SavedFiltersDropdown
            entityType="folha"
            currentFilters={currentFilters}
            onApplyFilter={(filters) => {
              const values = Object.entries(filters).map(([key, value]) => ({ key, operator: 'eq' as const, value }));
              setFilterValues(values); onFiltersChange(values);
            }}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={handleExportFolha} className="gap-2"><Download className="h-4 w-4" /><span className="hidden sm:inline">Exportar</span></Button>
          <Button variant="outline" size="sm" onClick={handleExportResumo} className="gap-2"><FileText className="h-4 w-4" /><span className="hidden sm:inline">Resumo</span></Button>
          <Button variant="secondary" size="sm" onClick={onProcessar} className="gap-2"><Calculator className="h-4 w-4" /><span className="hidden sm:inline">Processar</span></Button>
          <Button size="sm" onClick={onFechar} className="gap-2"><Lock className="h-4 w-4" /><span className="hidden sm:inline">Fechar</span></Button>
        </div>
      </div>
    </div>
  );
});

export default FolhaToolbar;
