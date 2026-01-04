import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileDown, FolderDown, Archive, FileText, Image, FileSpreadsheet, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Documento {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  formato: "pdf" | "docx" | "xlsx" | "jpg" | "png" | "zip" | "outros";
}

interface DocumentoDownloadProps {
  documentos: Documento[];
  onDownload?: (documentoId: string) => Promise<string>;
  onDownloadMultiplo?: (documentoIds: string[], formato: string) => Promise<string>;
  permitirSelecao?: boolean;
  permitirZip?: boolean;
}

const formatoIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  docx: FileText,
  xlsx: FileSpreadsheet,
  jpg: Image,
  png: Image,
  zip: Archive,
  outros: FileText
};

export function DocumentoDownload({
  documentos,
  onDownload,
  onDownloadMultiplo,
  permitirSelecao = true,
  permitirZip = true
}: DocumentoDownloadProps) {
  const { toast } = useToast();
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [progresso, setProgresso] = useState(0);
  const [formatoExport, setFormatoExport] = useState("original");

  const formatarTamanho = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = async (doc: Documento) => {
    setDownloading(doc.id);
    setProgresso(0);
    
    try {
      const interval = setInterval(() => {
        setProgresso(prev => Math.min(prev + 10, 90));
      }, 100);

      const url = onDownload ? await onDownload(doc.id) : doc.url;
      
      clearInterval(interval);
      setProgresso(100);

      const link = document.createElement("a");
      link.href = url;
      link.download = doc.nome;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({ title: "Sucesso", description: `${doc.nome} baixado com sucesso` });
    } catch {
      toast({ title: "Erro", description: "Falha ao baixar documento", variant: "destructive" });
    } finally {
      setDownloading(null);
      setProgresso(0);
    }
  };

  const handleDownloadMultiplo = async () => {
    if (selecionados.length === 0) {
      toast({ title: "Aviso", description: "Selecione ao menos um documento", variant: "destructive" });
      return;
    }

    setDownloading("multiple");
    setProgresso(0);

    try {
      const interval = setInterval(() => {
        setProgresso(prev => Math.min(prev + 5, 90));
      }, 200);

      const url = await onDownloadMultiplo?.(selecionados, formatoExport);
      
      clearInterval(interval);
      setProgresso(100);

      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `documentos_${new Date().toISOString().split("T")[0]}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast({ title: "Sucesso", description: `${selecionados.length} documentos baixados` });
      setSelecionados([]);
    } catch {
      toast({ title: "Erro", description: "Falha ao baixar documentos", variant: "destructive" });
    } finally {
      setDownloading(null);
      setProgresso(0);
    }
  };

  const toggleSelecao = (id: string) => {
    setSelecionados(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const selecionarTodos = () => {
    setSelecionados(selecionados.length === documentos.length ? [] : documentos.map(d => d.id));
  };

  const tamanhoTotal = documentos.filter(d => selecionados.includes(d.id)).reduce((sum, d) => sum + d.tamanho, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2"><Download className="h-5 w-5" />Downloads</CardTitle>
        {permitirSelecao && selecionados.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selecionados.length} selecionados ({formatarTamanho(tamanhoTotal)})</Badge>
            {permitirZip && (
              <Select value={formatoExport} onValueChange={setFormatoExport}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">Original</SelectItem>
                  <SelectItem value="pdf">Converter p/ PDF</SelectItem>
                  <SelectItem value="zip">ZIP</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Button onClick={handleDownloadMultiplo} disabled={downloading === "multiple"}>
              {downloading === "multiple" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FolderDown className="h-4 w-4 mr-2" />}
              Baixar Selecionados
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {permitirSelecao && documentos.length > 0 && (
          <div className="flex items-center gap-2 pb-2 border-b">
            <Checkbox checked={selecionados.length === documentos.length} onCheckedChange={selecionarTodos} />
            <span className="text-sm text-muted-foreground">Selecionar todos</span>
          </div>
        )}

        {downloading && (
          <div className="space-y-2">
            <Progress value={progresso} className="h-2" />
            <p className="text-sm text-center text-muted-foreground">{progresso}%</p>
          </div>
        )}

        {documentos.map(doc => {
          const Icon = formatoIcons[doc.formato] || FileText;
          const isDownloading = downloading === doc.id;
          const isSelected = selecionados.includes(doc.id);

          return (
            <div key={doc.id} className={`flex items-center justify-between p-3 border rounded-lg ${isSelected ? "bg-muted/50 border-primary" : ""}`}>
              <div className="flex items-center gap-3">
                {permitirSelecao && <Checkbox checked={isSelected} onCheckedChange={() => toggleSelecao(doc.id)} />}
                <Icon className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">{doc.nome}</p>
                  <p className="text-sm text-muted-foreground">{doc.tipo} • {formatarTamanho(doc.tamanho)}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleDownload(doc)} disabled={isDownloading}>
                {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
              </Button>
            </div>
          );
        })}

        {documentos.length === 0 && <p className="text-center text-muted-foreground py-4">Nenhum documento disponível</p>}
      </CardContent>
    </Card>
  );
}

export default DocumentoDownload;
