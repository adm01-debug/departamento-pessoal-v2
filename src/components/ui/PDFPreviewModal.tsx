import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, ExternalLink } from "lucide-react";

interface PDFPreviewModalProps { open: boolean; onOpenChange: (open: boolean) => void; title: string; src: string; onDownload?: () => void; onPrint?: () => void; }

export function PDFPreviewModal({ open, onOpenChange, title, src, onDownload, onPrint }: PDFPreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <div className="flex gap-2">
              {onPrint && <Button variant="outline" size="sm" onClick={onPrint}><Printer className="h-4 w-4 mr-1" />Imprimir</Button>}
              {onDownload && <Button variant="outline" size="sm" onClick={onDownload}><Download className="h-4 w-4 mr-1" />Download</Button>}
              <Button variant="outline" size="sm" onClick={() => window.open(src, "_blank")}><ExternalLink className="h-4 w-4 mr-1" />Abrir</Button>
            </div>
          </div>
        </DialogHeader>
        <iframe src={src} className="flex-1 w-full border rounded" title={title} />
      </DialogContent>
    </Dialog>
  );
}
export default PDFPreviewModal;
