import { memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
interface PrintPreviewProps { open: boolean; onOpenChange: (o: boolean) => void; children: React.ReactNode; titulo?: string; }
export const PrintPreview = memo(function PrintPreview({ open, onOpenChange, children, titulo = 'Pré-visualização' }: PrintPreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader><DialogTitle>{titulo}</DialogTitle></DialogHeader>
        <div className="border rounded-lg p-4 bg-white">{children}</div>
        <DialogFooter><Button onClick={() => window.print()}><Printer className="h-4 w-4 mr-2" />Imprimir</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
