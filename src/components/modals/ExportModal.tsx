/**
 * @fileoverview Modal de exportação (modals)
 * @module components/modals/ExportModal
 */
import { memo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';

interface ExportModalProps { open: boolean; onOpenChange: (open: boolean) => void; onExport: (format: string) => void; formats?: { value: string; label: string }[]; }

export const ExportModal = memo(function ExportModal({ open, onOpenChange, onExport, formats = [{ value: 'xlsx', label: 'Excel' }, { value: 'csv', label: 'CSV' }, { value: 'pdf', label: 'PDF' }] }: ExportModalProps) {
  const [format, setFormat] = useState(formats[0]?.value || 'xlsx');
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent><DialogHeader><DialogTitle className="flex items-center gap-2"><Download className="h-5 w-5" />Exportar</DialogTitle></DialogHeader>
        <RadioGroup value={format} onValueChange={setFormat}>{formats.map(f => <div key={f.value} className="flex items-center gap-2 p-2 border rounded-lg"><RadioGroupItem value={f.value} id={f.value} /><Label htmlFor={f.value}>{f.label}</Label></div>)}</RadioGroup>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button onClick={() => { onExport(format); onOpenChange(false); }}>Exportar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
