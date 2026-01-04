import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ZoomIn, ZoomOut, RotateCw, Download, X, Maximize2, Minimize2, ChevronLeft, ChevronRight } from "lucide-react";

interface DocumentoPreviewProps {
  url: string;
  nome: string;
  tipo: "pdf" | "image" | "office";
  isOpen: boolean;
  onClose: () => void;
  onDownload?: () => void;
  paginas?: number;
}

export function DocumentoPreview({
  url,
  nome,
  tipo,
  isOpen,
  onClose,
  onDownload,
  paginas = 1
}: DocumentoPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [rotacao, setRotacao] = useState(0);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const aumentarZoom = () => setZoom(prev => Math.min(prev + 25, 200));
  const diminuirZoom = () => setZoom(prev => Math.max(prev - 25, 50));
  const rotacionar = () => setRotacao(prev => (prev + 90) % 360);

  const proximaPagina = () => setPaginaAtual(prev => Math.min(prev + 1, paginas));
  const paginaAnterior = () => setPaginaAtual(prev => Math.max(prev - 1, 1));

  const renderPreview = () => {
    if (tipo === "image") {
      return (
        <div className="flex items-center justify-center h-full overflow-auto">
          <img
            src={url}
            alt={nome}
            onLoad={() => setCarregando(false)}
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotacao}deg)`,
              transition: "transform 0.2s ease"
            }}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    if (tipo === "pdf") {
      return (
        <iframe
          src={`${url}#page=${paginaAtual}&zoom=${zoom}`}
          className="w-full h-full border-0"
          onLoad={() => setCarregando(false)}
          title={nome}
        />
      );
    }

    // Office (docx, xlsx, pptx) - usar Office Online Viewer
    return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
        className="w-full h-full border-0"
        onLoad={() => setCarregando(false)}
        title={nome}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${fullscreen ? "max-w-full h-screen m-0 rounded-none" : "max-w-4xl h-[80vh]"} p-0 flex flex-col`}>
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
          <DialogTitle className="truncate flex-1">{nome}</DialogTitle>
          <div className="flex items-center gap-2">
            {tipo === "image" && (
              <>
                <Button variant="ghost" size="icon" onClick={diminuirZoom} disabled={zoom <= 50}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm w-12 text-center">{zoom}%</span>
                <Button variant="ghost" size="icon" onClick={aumentarZoom} disabled={zoom >= 200}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={rotacionar}>
                  <RotateCw className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {paginas > 1 && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={paginaAnterior} disabled={paginaAtual <= 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">{paginaAtual}/{paginas}</span>
                <Button variant="ghost" size="icon" onClick={proximaPagina} disabled={paginaAtual >= paginas}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Button variant="ghost" size="icon" onClick={() => setFullscreen(!fullscreen)}>
              {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

            {onDownload && (
              <Button variant="ghost" size="icon" onClick={onDownload}>
                <Download className="h-4 w-4" />
              </Button>
            )}

            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 bg-gray-100 relative overflow-hidden">
          {carregando && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <Skeleton className="w-full h-full" />
            </div>
          )}
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DocumentoPreview;
