import { memo, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  X,
  Eye,
} from 'lucide-react';
import { z } from 'zod';
import { importCSV, ImportResult, downloadCSVTemplate } from '@/lib/csvImporter';
import { importExcel, downloadExcelTemplate } from '@/lib/excelImporter';
import { cn } from '@/lib/utils';

interface Column {
  key: string;
  label: string;
  example?: string;
}

interface DataImporterProps<T> {
  /** Schema Zod para validação */
  schema: z.ZodSchema<T>;
  /** Colunas esperadas (para template e preview) */
  columns: Column[];
  /** Função chamada ao confirmar importação */
  onImport: (data: T[]) => Promise<void>;
  /** Nome do arquivo para template */
  templateName?: string;
  /** Título do modal */
  title?: string;
  /** Descrição do modal */
  description?: string;
  /** Botão trigger customizado */
  trigger?: React.ReactNode;
  /** Callback após importação bem-sucedida */
  onSuccess?: () => void;
  /** Máximo de registros permitidos */
  maxRecords?: number;
}

export const DataImporter = memo(function DataImporter<T>({
  schema,
  columns,
  onImport,
  templateName = 'template',
  title = 'Importar Dados',
  description = 'Importe dados de um arquivo CSV ou Excel',
  trigger,
  onSuccess,
  maxRecords = 10000,
}: DataImporterProps<T>) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult<T> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setFile(null);
    setResult(null);
    setProgress(0);
    setShowPreview(false);
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setProgress(10);

    try {
      let importResult: ImportResult<T>;

      const isExcel = selectedFile.name.match(/\.xlsx?$/i);

      setProgress(30);

      if (isExcel) {
        importResult = await importExcel(selectedFile, schema);
      } else {
        importResult = await importCSV(selectedFile, schema);
      }

      setProgress(80);

      // Verificar limite de registros
      if (importResult.success.length > maxRecords) {
        importResult.warnings.push(
          `Limite de ${maxRecords} registros excedido. Apenas os primeiros ${maxRecords} serão importados.`
        );
        importResult.success = importResult.success.slice(0, maxRecords);
      }

      setResult(importResult);
      setProgress(100);
    } catch (error) {
      setResult({
        success: [],
        errors: [{
          row: 0,
          field: 'arquivo',
          value: selectedFile.name,
          error: (error as Error).message,
        }],
        total: 0,
        warnings: [],
      });
    } finally {
      setIsProcessing(false);
    }
  }, [schema, maxRecords]);

  const handleConfirmImport = useCallback(async () => {
    if (!result || result.success.length === 0) return;

    setIsImporting(true);
    setProgress(0);

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await onImport(result.success);

      clearInterval(progressInterval);
      setProgress(100);

      // Fechar e resetar após sucesso
      setTimeout(() => {
        setOpen(false);
        reset();
        onSuccess?.();
      }, 1000);
    } catch (error) {
      setResult(prev => prev ? {
        ...prev,
        warnings: [...prev.warnings, `Erro na importação: ${(error as Error).message}`],
      } : null);
    } finally {
      setIsImporting(false);
    }
  }, [result, onImport, reset, onSuccess]);

  const handleDownloadTemplate = useCallback((format: 'csv' | 'xlsx') => {
    if (format === 'csv') {
      downloadCSVTemplate(columns, templateName);
    } else {
      downloadExcelTemplate(columns, templateName);
    }
  }, [columns, templateName]);

  const getFileIcon = () => {
    if (!file) return <Upload className="h-8 w-8 text-muted-foreground" />;
    if (file.name.match(/\.xlsx?$/i)) return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
    return <FileText className="h-8 w-8 text-blue-600" />;
  };

  return (
    <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) reset(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Importar
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-hidden">
          {/* Área de upload */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              file ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
              isProcessing && "pointer-events-none opacity-50"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={isProcessing || isImporting}
            />

            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                {getFileIcon()}
                {file ? (
                  <div className="space-y-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="font-medium">Clique para selecionar arquivo</p>
                    <p className="text-sm text-muted-foreground">
                      Formatos aceitos: CSV, XLS, XLSX
                    </p>
                  </div>
                )}
              </div>
            </label>

            {file && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={(e) => { e.preventDefault(); reset(); }}
              >
                <X className="h-4 w-4 mr-1" />
                Remover
              </Button>
            )}
          </div>

          {/* Progresso */}
          {(isProcessing || isImporting) && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-center text-muted-foreground">
                {isProcessing ? 'Processando arquivo...' : 'Importando dados...'}
              </p>
            </div>
          )}

          {/* Resultado */}
          {result && !isProcessing && (
            <div className="space-y-3">
              {/* Summary */}
              <div className="flex gap-3">
                <Alert variant={result.errors.length === 0 ? 'default' : 'destructive'} className="flex-1">
                  {result.errors.length === 0 ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription className="flex items-center gap-2">
                    <Badge variant="secondary">{result.success.length}</Badge>
                    registros válidos
                    {result.errors.length > 0 && (
                      <>
                        <span className="mx-1">•</span>
                        <Badge variant="destructive">{result.errors.length}</Badge>
                        erros
                      </>
                    )}
                  </AlertDescription>
                </Alert>

                {result.success.length > 0 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPreview(!showPreview)}
                    title="Ver prévia"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside text-sm">
                      {result.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Errors */}
              {result.errors.length > 0 && (
                <ScrollArea className="h-32 border rounded-md p-3">
                  <div className="space-y-1 text-sm">
                    {result.errors.slice(0, 50).map((err, i) => (
                      <div key={i} className="text-destructive">
                        Linha {err.row}, campo "{err.field}": {err.error}
                      </div>
                    ))}
                    {result.errors.length > 50 && (
                      <div className="text-muted-foreground mt-2">
                        + {result.errors.length - 50} erros adicionais...
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}

              {/* Preview */}
              {showPreview && result.success.length > 0 && (
                <ScrollArea className="h-48 border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.slice(0, 5).map(col => (
                          <TableHead key={col.key}>{col.label}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.success.slice(0, 5).map((row, i) => (
                        <TableRow key={i}>
                          {columns.slice(0, 5).map(col => (
                            <TableCell key={col.key}>
                              {String((row as Record<string, unknown>)[col.key] ?? '-')}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </div>
          )}

          {/* Templates */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t">
            <span className="text-sm text-muted-foreground">Baixar modelo:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownloadTemplate('csv')}
              className="gap-1"
            >
              <Download className="h-3 w-3" />
              CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownloadTemplate('xlsx')}
              className="gap-1"
            >
              <Download className="h-3 w-3" />
              Excel
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmImport}
            disabled={!result || result.success.length === 0 || isImporting}
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Importar {result?.success.length ?? 0} Registros
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default DataImporter;
