/**
 * @fileoverview Modal para importação de backup
 * @module components/backup/BackupImportModal
 */
import { memo, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileArchive, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BackupImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport?: (file: File) => Promise<void>;
}

/**
 * Modal para restauração de backup
 */
export const BackupImportModal = memo(function BackupImportModal({
  open, onOpenChange, onImport
}: BackupImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.name.endsWith('.zip') || dropped?.name.endsWith('.sql')) {
      setFile(dropped);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleImport = async () => {
    if (!file || !onImport) return;
    setStatus('uploading');
    try {
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 200));
      }
      await onImport(file);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const reset = () => {
    setFile(null);
    setProgress(0);
    setStatus('idle');
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Backup</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {status === 'success' ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
              <p className="font-medium">Backup restaurado com sucesso!</p>
            </div>
          ) : status === 'uploading' ? (
            <div className="py-4">
              <p className="text-sm text-center mb-2">Restaurando backup...</p>
              <Progress value={progress} />
              <p className="text-xs text-center text-muted-foreground mt-2">{progress}%</p>
            </div>
          ) : (
            <>
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Esta ação substituirá todos os dados atuais!</AlertDescription>
              </Alert>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('backup-file')?.click()}
              >
                <input id="backup-file" type="file" accept=".zip,.sql" className="hidden" onChange={handleFileChange} />
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileArchive className="h-8 w-8 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Arraste o arquivo ou clique para selecionar</p>
                    <p className="text-xs text-muted-foreground mt-1">Formatos: .zip, .sql</p>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {status === 'success' ? 'Fechar' : 'Cancelar'}
          </Button>
          {status === 'idle' && file && (
            <Button variant="destructive" onClick={handleImport}>Restaurar Backup</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
