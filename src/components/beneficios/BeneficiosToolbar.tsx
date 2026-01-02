import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, RefreshCw } from 'lucide-react';
import { SearchInput } from '@/components/SearchInput';
import { DataImporter } from '@/components/DataImporter';
import { BulkActionsBar, defaultBulkActions } from '@/components/BulkActionsBar';
import { beneficioImportSchema, importTemplates } from '@/lib/dpSchemas';
import { exportToExcel } from '@/lib/excelImporter';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BeneficiosToolbarProps {
  onSearch: (term: string) => void;
  onRefresh: () => void;
  onNewClick: () => void;
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  data?: unknown[];
}

export const BeneficiosToolbar = memo(function BeneficiosToolbar({ onSearch, onRefresh, onNewClick, selectedCount, onClearSelection, onBulkDelete, data = [] }: BeneficiosToolbarProps) {
  const handleImport = async (beneficios: unknown[]) => {
    const { error } = await supabase.from('beneficios').insert(beneficios);
    if (error) throw error;
    toast.success(`${beneficios.length} benefícios importados!`);
    onRefresh();
  };

  const handleExport = () => {
    if (data.length === 0) { toast.warning('Nenhum dado'); return; }
    exportToExcel(data as Record<string, unknown>[], [{ key: 'nome' as const, label: 'Nome' }, { key: 'tipo' as const, label: 'Tipo' }, { key: 'valor' as const, label: 'Valor' }], 'beneficios', 'Benefícios');
    toast.success('Exportado!');
  };

  return (
    <div className="space-y-3">
      {selectedCount > 0 && <BulkActionsBar selectedCount={selectedCount} onClearSelection={onClearSelection} actions={[defaultBulkActions.delete(onBulkDelete)]} />}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <SearchInput onSearch={onSearch} placeholder="Buscar benefício..." className="w-64" />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw className="h-4 w-4" /></Button>
          <DataImporter schema={beneficioImportSchema} columns={[{ key: 'nome', label: 'Nome', example: 'Vale Refeição' }, { key: 'tipo', label: 'Tipo', example: 'Vale Refeição' }, { key: 'valor', label: 'Valor', example: '500.00' }]} onImport={handleImport} templateName="beneficios" title="Importar Benefícios" trigger={<Button variant="outline" size="sm"><Upload className="h-4 w-4" /></Button>} onSuccess={onRefresh} />
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4" /></Button>
          <Button size="sm" onClick={onNewClick}><Plus className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
});
export default BeneficiosToolbar;
