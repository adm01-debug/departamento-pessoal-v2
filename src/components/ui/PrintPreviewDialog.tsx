import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

interface PrintPreviewDialogProps { open: boolean; onOpenChange: (open: boolean) => void; title: string; children: React.ReactNode; onPrint: () => void; onDownload?: () => void; }

export function PrintPreviewDialog({ open, onOpenChange, title, children, onPrint, onDownload }: PrintPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="flex-1 overflow-auto border rounded p-8 bg-white">{children}</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
          {onDownload && <Button variant="outline" onClick={onDownload}><Download className="h-4 w-4 mr-1" />Download</Button>}
          <Button onClick={onPrint}><Printer className="h-4 w-4 mr-1" />Imprimir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default PrintPreviewDialog;
