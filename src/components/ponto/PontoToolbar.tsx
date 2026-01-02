import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Clock, Calendar } from 'lucide-react';
import { SearchInput } from '@/components/SearchInput';
import { SavedFiltersDropdown } from '@/components/SavedFiltersDropdown';
import { BulkActionsBar } from '@/components/BulkActionsBar';
import { exportToExcel } from '@/lib/excelImporter';
import { toast } from 'sonner';

interface PontoToolbarProps {
  onSearch: (term: string) => void;
  onRefresh: () => void;
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAprovar: () => void;
  currentFilters: Record<string, unknown>;
  data?: unknown[];
  competencia?: string;
}

export const PontoToolbar = memo(function PontoToolbar({ onSearch, onRefresh, selectedCount, onClearSelection, onBulkAprovar, currentFilters, data = [], competencia }: PontoToolbarProps) {
  const handleExport = () => {
    if (data.length === 0) { toast.warning('Nenhum dado'); return; }
    exportToExcel(data as Record<string, unknown>[], [{ key: 'colaborador_nome' as const, label: 'Colaborador' }, { key: 'data' as const, label: 'Data' }, { key: 'entrada' as const, label: 'Entrada' }, { key: 'saida' as const, label: 'Saída' }, { key: 'horas_trabalhadas' as const, label: 'Horas' }], `ponto_${competencia || 'atual'}`, 'Ponto');
    toast.success('Exportado!');
  };

  const bulkActions = [{ key: 'aprovar', label: 'Aprovar', icon: <Clock className="h-4 w-4" />, onClick: onBulkAprovar }];

  return (
    <div className="space-y-3">
      {selectedCount > 0 && <BulkActionsBar selectedCount={selectedCount} onClearSelection={onClearSelection} actions={bulkActions} />}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <SearchInput onSearch={onSearch} placeholder="Buscar colaborador..." className="w-64" />
          <SavedFiltersDropdown entityType="ponto" currentFilters={currentFilters} onApplyFilter={() => {}} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
});
export default PontoToolbar;
