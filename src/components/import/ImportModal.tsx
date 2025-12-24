import { memo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileSpreadsheet } from 'lucide-react';
interface ImportModalProps { open: boolean; onOpenChange: (o: boolean) => void; onImport: (file: File) => void; accept?: string; }
export const ImportModal = memo(function ImportModal({ open, onOpenChange, onImport, accept = '.xlsx,.csv' }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Upload className="h-5 w-5" />Importar Dados</DialogTitle></DialogHeader>
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <Input type="file" accept={accept} onChange={e => setFile(e.target.files?.[0] || null)} className="max-w-xs mx-auto" />
          {file && <p className="text-sm mt-2">{file.name}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button disabled={!file} onClick={() => { if(file) { onImport(file); onOpenChange(false); } }}><Upload className="h-4 w-4 mr-2" />Importar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
