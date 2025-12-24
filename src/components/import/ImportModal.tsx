/**
 * @fileoverview Modal de importação
 * @module components/import/ImportModal
 */
import { memo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, X } from 'lucide-react';

interface ImportModalProps { open: boolean; onOpenChange: (open: boolean) => void; onImport: (file: File) => void; accept?: string; }

export const ImportModal = memo(function ImportModal({ open, onOpenChange, onImport, accept = '.csv,.xlsx' }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Upload className="h-5 w-5" />Importar Dados</DialogTitle></DialogHeader>
        <div className="border-2 border-dashed rounded-lg p-8 text-center" onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
          {file ? (
            <div className="flex items-center justify-center gap-2"><FileSpreadsheet className="h-8 w-8 text-green-500" /><span>{file.name}</span><Button variant="ghost" size="icon" onClick={() => setFile(null)}><X className="h-4 w-4" /></Button></div>
          ) : (<><Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" /><p className="text-sm text-muted-foreground">Arraste um arquivo ou clique para selecionar</p><input type="file" accept={accept} onChange={e => e.target.files?.[0] && setFile(e.target.files[0])} className="hidden" id="import-file" /><Button variant="link" onClick={() => document.getElementById('import-file')?.click()}>Selecionar arquivo</Button></>)}
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button disabled={!file} onClick={() => { if(file) { onImport(file); onOpenChange(false); } }}>Importar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
