import { useState, memo, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader2, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { usePontoMelhorado } from '@/hooks/usePontoMelhorado';
import { format } from 'date-fns';
import { z } from 'zod';

interface ImportacaoPontoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  competencia: string;
  onSuccess?: () => void;
}

type FormatoArquivo = 'csv' | 'txt_rep';

const formatoDescricao: Record<FormatoArquivo, { label: string; descricao: string; exemplo: string }> = {
  csv: {
    label: 'CSV (Planilha)',
    descricao: 'Arquivo separado por vírgula ou ponto-e-vírgula',
    exemplo: 'matricula;data;entrada_1;saida_1;entrada_2;saida_2\n001;2025-12-01;08:00;12:00;13:00;17:00',
  },
  txt_rep: {
    label: 'TXT REP (Relógio)',
    descricao: 'Arquivo de registro eletrônico de ponto',
    exemplo: '001|01122025|0800\n001|01122025|1200\n001|01122025|1300\n001|01122025|1700',
  },
};

export const ImportacaoPontoModal = memo(function ImportacaoPontoModal({ open, onOpenChange, competencia, onSuccess }: ImportacaoPontoModalProps) {
  const { importarArquivo, importProgress } = usePontoMelhorado();
  
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [formato, setFormato] = useState<FormatoArquivo>('csv');
  const [processando, setProcessando] = useState(false);
  const [resultado, setResultado] = useState<{ sucesso: number; erros: string[] } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Handlers de drag & drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    // Validar extensão
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'txt'].includes(ext ?? '')) {
      alert('Formato inválido. Use arquivos .csv ou .txt');
      return;
    }
    
    setArquivo(file);
    setResultado(null);
    
    // Auto-detectar formato
    if (ext === 'csv') {
      setFormato('csv');
    } else if (ext === 'txt') {
      setFormato('txt_rep');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleImportar = async () => {
    if (!arquivo) return;
    
    setProcessando(true);
    setResultado(null);
    
    try {
      const res = await importarArquivo(arquivo, formato, competencia);
      setResultado(res);
      
      if (res.sucesso > 0 && res.erros.length === 0) {
        onSuccess?.();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setResultado({ sucesso: 0, erros: [errorMessage] });
    } finally {
      setProcessando(false);
    }
  };

  const handleClose = () => {
    if (!processando) {
      setArquivo(null);
      setResultado(null);
      onOpenChange(false);
    }
  };

  const downloadModelo = () => {
    const info = formatoDescricao[formato];
    const blob = new Blob([info.exemplo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modelo_ponto.${formato === 'csv' ? 'csv' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Importar Registros de Ponto</DialogTitle>
          <DialogDescription>
            Competência: {competencia}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Seleção de formato */}
          <div className="space-y-2">
            <Label>Formato do Arquivo</Label>
            <Select value={formato} onValueChange={(v) => setFormato(v as FormatoArquivo)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border z-50">
                {Object.entries(formatoDescricao).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    {info.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formatoDescricao[formato].descricao}
            </p>
          </div>

          {/* Área de upload */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
              dragActive ? "border-primary bg-primary/5" : "border-border",
              arquivo ? "bg-muted/30" : ""
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {arquivo ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{arquivo.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(arquivo.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setArquivo(null);
                    setResultado(null);
                  }}
                  disabled={processando}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <Upload className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-foreground mb-1">
                  Arraste o arquivo aqui ou{' '}
                  <span className="text-primary underline">clique para selecionar</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Suporta arquivos .csv e .txt
                </p>
                <input
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleFileInput}
                  disabled={processando}
                />
              </label>
            )}
          </div>

          {/* Progresso */}
          {processando && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Importando...</span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} className="h-2" />
            </div>
          )}

          {/* Resultado */}
          {resultado && (
            <div className="space-y-3">
              {resultado.sucesso > 0 && (
                <Alert className="bg-success/10 border-success/30">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success">
                    {resultado.sucesso} registro(s) importado(s) com sucesso!
                  </AlertDescription>
                </Alert>
              )}

              {resultado.erros.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {resultado.erros.length} erro(s) encontrado(s)
                  </AlertDescription>
                </Alert>
              )}

              {resultado.erros.length > 0 && (
                <ScrollArea className="h-32 rounded border border-border p-2">
                  <div className="space-y-1 text-xs text-destructive">
                    {resultado.erros.map((erro, i) => (
                      <p key={i}>• {erro}</p>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}

          {/* Modelo */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Precisa de um modelo?
            </span>
            <Button variant="link" size="sm" onClick={downloadModelo} className="gap-1">
              <Download className="w-3 h-3" />
              Baixar modelo
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={processando}>
            {resultado?.sucesso ? 'Fechar' : 'Cancelar'}
          </Button>
          <Button 
            onClick={handleImportar} 
            disabled={!arquivo || processando}
            className="gap-2"
          >
            {processando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Importar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});