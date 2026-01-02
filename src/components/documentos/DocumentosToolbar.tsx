import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, RefreshCw, FileText } from 'lucide-react';
import { SearchInput } from '@/components/SearchInput';
import { BulkActionsBar, defaultBulkActions } from '@/components/BulkActionsBar';
import { VersionHistory } from '@/components/VersionHistory';
import { exportToExcel } from '@/lib/excelImporter';
import { toast } from 'sonner';

interface DocumentosToolbarProps {
  onSearch: (term: string) => void;
  onRefresh: () => void;
  onNewClick: () => void;
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  selectedDocumentId?: string;
  data?: unknown[];
}

export const DocumentosToolbar = memo(function DocumentosToolbar({ onSearch, onRefresh, onNewClick, selectedCount, onClearSelection, onBulkDelete, selectedDocumentId, data = [] }: DocumentosToolbarProps) {
  const handleExport = () => {
    if (data.length === 0) { toast.warning('Nenhum dado'); return; }
    exportToExcel(data as Record<string, unknown>[], [{ key: 'colaborador_nome' as const, label: 'Colaborador' }, { key: 'tipo' as const, label: 'Tipo' }, { key: 'numero' as const, label: 'Número' }, { key: 'data_validade' as const, label: 'Validade' }], 'documentos', 'Documentos');
    toast.success('Exportado!');
  };

  return (
    <div className="space-y-3">
      {selectedCount > 0 && <BulkActionsBar selectedCount={selectedCount} onClearSelection={onClearSelection} actions={[defaultBulkActions.archive(() => {}), defaultBulkActions.delete(onBulkDelete)]} />}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <SearchInput onSearch={onSearch} placeholder="Buscar documento..." className="w-64" />
          {selectedDocumentId && <VersionHistory entityType="documentos" entityId={selectedDocumentId} trigger={<Button variant="outline" size="sm"><FileText className="h-4 w-4 mr-1" />Versões</Button>} />}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4" /></Button>
          <Button size="sm" onClick={onNewClick}><Plus className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
});
export default DocumentosToolbar;
