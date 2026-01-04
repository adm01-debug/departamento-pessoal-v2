import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Download, ZoomIn, ZoomOut, RotateCw, Maximize2, X, ChevronLeft, ChevronRight, FileText, Image, FileSpreadsheet } from "lucide-react";

interface DocumentoPreviewProps {
  documento: {
    id: string;
    nome: string;
    tipo: string;
    url: string;
    formato: "pdf" | "image" | "office" | "text";
    paginas?: number;
  };
  onDownload?: () => void;
  onFechar?: () => void;
  modoModal?: boolean;
}

export function DocumentoPreview({ documento, onDownload, onFechar, modoModal = false }: DocumentoPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [rotacao, setRotacao] = useState(0);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  const aumentarZoom = () => setZoom(prev => Math.min(prev + 25, 200));
  const diminuirZoom = () => setZoom(prev => Math.max(prev - 25, 50));
  const rotacionar = () => setRotacao(prev => (prev + 90) % 360);
  const paginaAnterior = () => setPaginaAtual(prev => Math.max(prev - 1, 1));
  const proximaPagina = () => setPaginaAtual(prev => Math.min(prev + 1, documento.paginas || 1));

  const renderPreview = () => {
    const style = {
      transform: `scale(${zoom / 100}) rotate(${rotacao}deg)`,
      transition: "transform 0.3s ease"
    };

    switch (documento.formato) {
      case "pdf":
        return (
          <iframe
            src={`${documento.url}#page=${paginaAtual}`}
            className="w-full h-[600px] border-0"
            style={style}
            title={documento.nome}
          />
        );
      case "image":
        return (
          <div className="flex items-center justify-center bg-gray-100 min-h-[400px]">
            <img src={documento.url} alt={documento.nome} className="max-w-full max-h-[600px] object-contain" style={style} />
          </div>
        );
      case "office":
        return (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(documento.url)}`}
            className="w-full h-[600px] border-0"
            title={documento.nome}
          />
        );
      case "text":
        return (
          <div className="bg-gray-50 p-4 rounded-lg min-h-[400px] overflow-auto">
            <pre className="whitespace-pre-wrap font-mono text-sm">Carregando conteúdo...</pre>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <FileText className="h-16 w-16 mb-4" />
            <p>Preview não disponível para este formato</p>
            <Button onClick={onDownload} className="mt-4"><Download className="h-4 w-4 mr-2" />Baixar Documento</Button>
          </div>
        );
    }
  };

  const formatoIcon = {
    pdf: FileText,
    image: Image,
    office: FileSpreadsheet,
    text: FileText
  };
  const Icon = formatoIcon[documento.formato] || FileText;

  const content = (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-muted p-2 rounded-lg">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <span className="font-medium truncate max-w-[200px]">{documento.nome}</span>
          <Badge variant="secondary">{documento.tipo}</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={diminuirZoom} disabled={zoom <= 50}><ZoomOut className="h-4 w-4" /></Button>
          <span className="text-sm w-12 text-center">{zoom}%</span>
          <Button variant="ghost" size="icon" onClick={aumentarZoom} disabled={zoom >= 200}><ZoomIn className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={rotacionar}><RotateCw className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setFullscreen(!fullscreen)}><Maximize2 className="h-4 w-4" /></Button>
          {onDownload && <Button variant="ghost" size="icon" onClick={onDownload}><Download className="h-4 w-4" /></Button>}
        </div>
      </div>

      {/* Preview Area */}
      <div className={`border rounded-lg overflow-hidden ${fullscreen ? "fixed inset-0 z-50 bg-white" : ""}`}>
        {fullscreen && (
          <div className="absolute top-4 right-4 z-10">
            <Button variant="outline" size="icon" onClick={() => setFullscreen(false)}><X className="h-4 w-4" /></Button>
          </div>
        )}
        {renderPreview()}
      </div>

      {/* Paginação */}
      {documento.paginas && documento.paginas > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="sm" onClick={paginaAnterior} disabled={paginaAtual === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Página {paginaAtual} de {documento.paginas}</span>
          <Button variant="outline" size="sm" onClick={proximaPagina} disabled={paginaAtual === documento.paginas}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );

  if (modoModal) {
    return (
      <Dialog open onOpenChange={() => onFechar?.()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Eye className="h-5 w-5" />Visualizar Documento</DialogTitle></DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5" />Preview</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}

export default DocumentoPreview;
