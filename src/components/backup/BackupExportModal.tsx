import { memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Check,
  X,
  Loader2,
  Database,
  Shield,
} from 'lucide-react';
import { useBackupExport, BackupProgress } from '@/hooks/useBackupExport';

interface BackupExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BackupExportModal = memo(function BackupExportModal({ open, onOpenChange }: BackupExportModalProps) {
  const {
    isExporting,
    progress,
    exportToJSON,
    exportToExcelWorkbook,
    exportToPDFReport,
    TABLE_LABELS,
  } = useBackupExport();

  const completedTables = progress.filter(p => p.status === 'done').length;
  const totalTables = progress.length;
  const progressPercent = totalTables > 0 ? (completedTables / totalTables) * 100 : 0;

  const getStatusIcon = (status: BackupProgress['status']) => {
    switch (status) {
      case 'done':
        return <Check className="w-4 h-4 text-success" />;
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
      case 'error':
        return <X className="w-4 h-4 text-destructive" />;
      default:
        return <Database className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Backup & Export Completo
          </DialogTitle>
          <DialogDescription>
            Exporte todos os dados do sistema para fins de compliance e backup.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Options */}
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={exportToJSON}
              disabled={isExporting}
            >
              <FileJson className="w-8 h-8 text-info" />
              <span className="text-sm font-medium">JSON Completo</span>
              <span className="text-xs text-muted-foreground">Todos os dados</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={exportToExcelWorkbook}
              disabled={isExporting}
            >
              <FileSpreadsheet className="w-8 h-8 text-success" />
              <span className="text-sm font-medium">Excel Workbook</span>
              <span className="text-xs text-muted-foreground">Múltiplas abas</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={exportToPDFReport}
              disabled={isExporting}
            >
              <FileText className="w-8 h-8 text-destructive" />
              <span className="text-sm font-medium">Relatório PDF</span>
              <span className="text-xs text-muted-foreground">Resumo executivo</span>
            </Button>
          </div>

          {/* Progress */}
          {isExporting && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Exportando dados...</span>
                <span className="text-sm text-muted-foreground">
                  {completedTables} de {totalTables} tabelas
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />

              <ScrollArea className="h-48 rounded-md border p-4">
                <div className="space-y-2">
                  {progress.map((p) => (
                    <div
                      key={p.table}
                      className="flex items-center justify-between py-1"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(p.status)}
                        <span className="text-sm">{TABLE_LABELS[p.table]}</span>
                      </div>
                      {p.status === 'done' && (
                        <Badge variant="secondary" className="text-xs">
                          {p.count} registros
                        </Badge>
                      )}
                      {p.status === 'error' && (
                        <Badge variant="destructive" className="text-xs">
                          Erro
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Info */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="text-sm font-medium mb-2">Dados incluídos no backup:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>• Colaboradores e dependentes</div>
              <div>• Admissões e desligamentos</div>
              <div>• Férias e afastamentos</div>
              <div>• Registros de ponto</div>
              <div>• Folhas e holerites</div>
              <div>• Benefícios</div>
              <div>• Histórico de cargos</div>
              <div>• Log de auditoria</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});