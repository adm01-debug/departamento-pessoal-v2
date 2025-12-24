/**
 * @fileoverview Modal de exportação
 * @module components/export/ExportModal
 */
import { memo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';

interface ExportModalProps { open: boolean; onOpenChange: (open: boolean) => void; onExport: (format: string) => void; }

export const ExportModal = memo(function ExportModal({ open, onOpenChange, onExport }: ExportModalProps) {
  const [format, setFormat] = useState('xlsx');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Download className="h-5 w-5" />Exportar Dados</DialogTitle></DialogHeader>
        <RadioGroup value={format} onValueChange={setFormat} className="space-y-2">
          <div className="flex items-center space-x-2 p-3 border rounded-lg"><RadioGroupItem value="xlsx" id="xlsx" /><Label htmlFor="xlsx" className="flex items-center gap-2 cursor-pointer"><FileSpreadsheet className="h-4 w-4" />Excel (.xlsx)</Label></div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg"><RadioGroupItem value="csv" id="csv" /><Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer"><FileText className="h-4 w-4" />CSV (.csv)</Label></div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg"><RadioGroupItem value="pdf" id="pdf" /><Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer"><FileText className="h-4 w-4" />PDF (.pdf)</Label></div>
        </RadioGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => { onExport(format); onOpenChange(false); }}><Download className="h-4 w-4 mr-2" />Exportar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
