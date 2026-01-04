import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Download, FileText, FileSpreadsheet, File, Loader2, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type FormatoDownload = "pdf" | "docx" | "xlsx" | "original";

interface DocumentoDownloadProps {
  documentoId: string;
  documentoNome: string;
  urlOriginal?: string;
  formatosDisponiveis?: FormatoDownload[];
  onDownload?: (formato: FormatoDownload) => Promise<string>;
  disabled?: boolean;
}

const formatoConfig: Record<FormatoDownload, { label: string; icon: React.ElementType; mime: string }> = {
  pdf: { label: "PDF", icon: FileText, mime: "application/pdf" },
  docx: { label: "Word (DOCX)", icon: FileText, mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  xlsx: { label: "Excel (XLSX)", icon: FileSpreadsheet, mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  original: { label: "Original", icon: File, mime: "application/octet-stream" }
};

export function DocumentoDownload({
  documentoId,
  documentoNome,
  urlOriginal,
  formatosDisponiveis = ["pdf", "original"],
  onDownload,
  disabled = false
}: DocumentoDownloadProps) {
  const [downloading, setDownloading] = useState<FormatoDownload | null>(null);
  const [progress, setProgress] = useState(0);

  const handleDownload = async (formato: FormatoDownload) => {
    try {
      setDownloading(formato);
      setProgress(10);

      let url: string;
      
      if (onDownload) {
        setProgress(30);
        url = await onDownload(formato);
        setProgress(70);
      } else if (urlOriginal && formato === "original") {
        url = urlOriginal;
        setProgress(50);
      } else {
        throw new Error("URL de download não disponível");
      }

      setProgress(90);
      
      // Criar link e fazer download
      const link = document.createElement("a");
      link.href = url;
      link.download = `${documentoNome}.${formato === "original" ? "pdf" : formato}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setProgress(100);
      toast.success("Download iniciado com sucesso!");
      
    } catch (error) {
      toast.error("Erro ao fazer download do documento");
      console.error(error);
    } finally {
      setTimeout(() => {
        setDownloading(null);
        setProgress(0);
      }, 500);
    }
  };

  if (formatosDisponiveis.length === 1) {
    const formato = formatosDisponiveis[0];
    const config = formatoConfig[formato];
    const Icon = config.icon;

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDownload(formato)}
        disabled={disabled || downloading !== null}
      >
        {downloading === formato ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        Download {config.label}
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled || downloading !== null}>
            {downloading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Download
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {formatosDisponiveis.map((formato) => {
            const config = formatoConfig[formato];
            const Icon = config.icon;
            return (
              <DropdownMenuItem
                key={formato}
                onClick={() => handleDownload(formato)}
                disabled={downloading !== null}
              >
                <Icon className="h-4 w-4 mr-2" />
                {config.label}
                {downloading === formato && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {downloading && progress > 0 && (
        <Progress value={progress} className="h-1" />
      )}
    </div>
  );
}

export type { FormatoDownload };
export default DocumentoDownload;
