import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, RefreshCw } from 'lucide-react';
import { SearchInput } from '@/components/SearchInput';
import { SavedFiltersDropdown } from '@/components/SavedFiltersDropdown';
import { DataImporter } from '@/components/DataImporter';
import { BulkActionsBar, defaultBulkActions } from '@/components/BulkActionsBar';
import { afastamentoImportSchema, importTemplates } from '@/lib/dpSchemas';
import { exportToExcel } from '@/lib/excelImporter';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AfastamentosToolbarProps {
  onSearch: (term: string) => void;
  onRefresh: () => void;
  onNewClick: () => void;
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  currentFilters: Record<string, unknown>;
  data?: unknown[];
}

export const AfastamentosToolbar = memo(function AfastamentosToolbar({
  onSearch, onRefresh, onNewClick, selectedCount, onClearSelection, onBulkDelete, currentFilters, data = [],
}: AfastamentosToolbarProps) {
  const handleImport = async (afastamentos: unknown[]) => {
    const { error } = await supabase.from('afastamentos').insert(afastamentos);
    if (error) throw error;
    toast.success(`${afastamentos.length} afastamentos importados!`);
    onRefresh();
  };

  const handleExport = () => {
    if (data.length === 0) { toast.warning('Nenhum dado'); return; }
    const columns = [
      { key: 'colaborador_nome' as const, label: 'Colaborador' },
      { key: 'tipo' as const, label: 'Tipo' },
      { key: 'data_inicio' as const, label: 'Início' },
      { key: 'data_fim' as const, label: 'Fim' },
      { key: 'motivo' as const, label: 'Motivo' },
    ];
    exportToExcel(data as Record<string, unknown>[], columns, 'afastamentos', 'Afastamentos');
    toast.success('Exportado!');
  };

  return (
    <div className="space-y-3">
      {selectedCount > 0 && <BulkActionsBar selectedCount={selectedCount} onClearSelection={onClearSelection} actions={[defaultBulkActions.delete(onBulkDelete)]} />}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <SearchInput onSearch={onSearch} placeholder="Buscar afastamento..." className="w-64" />
          <SavedFiltersDropdown entityType="afastamentos" currentFilters={currentFilters} onApplyFilter={() => {}} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw className="h-4 w-4" /></Button>
          <DataImporter schema={afastamentoImportSchema} columns={importTemplates.afastamentos} onImport={handleImport} templateName="afastamentos" title="Importar Afastamentos" trigger={<Button variant="outline" size="sm"><Upload className="h-4 w-4" /></Button>} onSuccess={onRefresh} />
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4" /></Button>
          <Button size="sm" onClick={onNewClick}><Plus className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
});
export default AfastamentosToolbar;
