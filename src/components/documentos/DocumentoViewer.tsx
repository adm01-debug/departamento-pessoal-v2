/**
 * @fileoverview Visualizador de documentos
 * @module components/documentos/DocumentoViewer
 */
import { memo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, RotateCw, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface DocumentoViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documento?: { nome: string; url: string; tipo: string; };
  onDownload?: () => void;
}

/**
 * Modal de visualização de documento
 */
export const DocumentoViewer = memo(function DocumentoViewer({
  open, onOpenChange, documento, onDownload
}: DocumentoViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const isImage = documento?.tipo?.includes('image');
  const isPdf = documento?.tipo?.includes('pdf');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle className="truncate flex-1">{documento?.nome}</DialogTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 50}><ZoomOut className="h-4 w-4" /></Button>
            <span className="text-sm w-12 text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 200}><ZoomIn className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={handleRotate}><RotateCw className="h-4 w-4" /></Button>
            {onDownload && <Button variant="ghost" size="icon" onClick={onDownload}><Download className="h-4 w-4" /></Button>}
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-auto bg-muted/50 rounded-lg min-h-[60vh] flex items-center justify-center">
          {isImage && documento?.url && (
            <img
              src={documento.url}
              alt={documento.nome}
              style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)`, transition: 'transform 0.2s' }}
              className="max-w-full max-h-full object-contain"
            />
          )}
          {isPdf && documento?.url && (
            <iframe src={documento.url} className="w-full h-full min-h-[60vh]" title={documento.nome} />
          )}
          {!isImage && !isPdf && (
            <div className="text-center p-8">
              <p className="text-muted-foreground">Pré-visualização não disponível</p>
              {onDownload && <Button className="mt-4" onClick={onDownload}><Download className="h-4 w-4 mr-2" />Baixar arquivo</Button>}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});
