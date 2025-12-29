import { memo } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X, Loader2, Download, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useImportacaoColaboradores, ColaboradorImport } from '@/hooks/useImportacaoColaboradores';
import { cn } from '@/lib/utils';

interface ImportacaoColaboradoresModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ImportacaoColaboradoresModal = memo(function ImportacaoColaboradoresModal({
  open,
  onOpenChange,
  onSuccess,
}: ImportacaoColaboradoresModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const {
    arquivo,
    dadosPreview,
    colunasDetectadas,
    processando,
    importando,
    resultado,
    processarArquivo,
    importarColaboradores,
    limpar,
    totalValidos,
    totalInvalidos,
  } = useImportacaoColaboradores();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidFile(file)) {
        processarArquivo(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processarArquivo(e.target.files[0]);
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];
    return validTypes.includes(file.type) || 
           file.name.endsWith('.xlsx') || 
           file.name.endsWith('.xls') || 
           file.name.endsWith('.csv');
  };

  const handleImportar = async () => {
    const result = await importarColaboradores();
    if (result && result.sucesso > 0) {
      onSuccess?.();
    }
  };

  const handleClose = () => {
    limpar();
    onOpenChange(false);
  };

  const downloadModelo = () => {
    const headers = [
      'Nome Completo',
      'CPF',
      'Data Nascimento',
      'Sexo',
      'Estado Civil',
      'Nome Mae',
      'Email',
      'Celular',
      'CEP',
      'Logradouro',
      'Numero',
      'Bairro',
      'Cidade',
      'UF',
      'Cargo',
      'Departamento',
      'Data Admissao',
      'Salario',
      'Tipo Contrato',
      'PIS',
      'Matricula',
    ];

    const exemplo = [
      'João da Silva',
      '123.456.789-00',
      '15/03/1990',
      'Masculino',
      'Casado',
      'Maria da Silva',
      'joao@email.com',
      '(11) 99999-9999',
      '01310-100',
      'Av. Paulista',
      '1000',
      'Bela Vista',
      'São Paulo',
      'SP',
      'Analista',
      'TI',
      '01/12/2024',
      '5000,00',
      'CLT',
      '123.45678.90-1',
      'MAT001',
    ];

    const csvContent = [
      headers.join(';'),
      exemplo.join(';'),
    ].join('
');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modelo_importacao_colaboradores.csv';
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Importação em Massa de Colaboradores
          </DialogTitle>
          <DialogDescription>
            Importe colaboradores a partir de uma planilha Excel ou CSV
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Upload Area */}
          {!arquivo && !resultado && (
            <div className="space-y-4">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                  processando && "opacity-50 pointer-events-none"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {processando ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Processando arquivo...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm font-medium mb-1">
                      Arraste o arquivo aqui ou clique para selecionar
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Formatos aceitos: XLSX, XLS, CSV (máx. 20MB)
                    </p>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      Selecionar Arquivo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="text-sm">
                  <p className="font-medium">Precisa de um modelo?</p>
                  <p className="text-muted-foreground text-xs">
                    Baixe o modelo com as colunas esperadas
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadModelo} className="gap-2">
                  <Download className="w-4 h-4" />
                  Baixar Modelo
                </Button>
              </div>
            </div>
          )}

          {/* Preview */}
          {arquivo && dadosPreview.length > 0 && !resultado && (
            <div className="flex-1 overflow-hidden flex flex-col gap-3">
              {/* File Info */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{arquivo.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {colunasDetectadas.length} colunas detectadas
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle2 className="w-3 h-3 text-success" />
                    {totalValidos} válidos
                  </Badge>
                  {totalInvalidos > 0 && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {totalInvalidos} com erros
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={limpar}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Columns Detected */}
              <div className="flex flex-wrap gap-1.5 p-2 bg-accent/30 rounded-lg">
                <span className="text-xs text-muted-foreground mr-1">Colunas:</span>
                {colunasDetectadas.slice(0, 10).map((col, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {col}
                  </Badge>
                ))}
                {colunasDetectadas.length > 10 && (
                  <Badge variant="secondary" className="text-xs">
                    +{colunasDetectadas.length - 10}
                  </Badge>
                )}
              </div>

              {/* Preview Table */}
              <ScrollArea className="flex-1 border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Linha</TableHead>
                      <TableHead className="w-12">Status</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Admissão</TableHead>
                      <TableHead className="w-12">Erros</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dadosPreview.slice(0, 100).map((item) => (
                      <TableRow key={item.linha} className={cn(!item.valido && "bg-destructive/5")}>
                        <TableCell className="text-muted-foreground text-xs">
                          {item.linha}
                        </TableCell>
                        <TableCell>
                          {item.valido ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-destructive" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {item.dados.nome_completo || '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.dados.cpf || '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.dados.cargo || '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.dados.departamento || '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.dados.data_admissao || '-'}
                        </TableCell>
                        <TableCell>
                          {item.erros.length > 0 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="destructive" className="text-xs">
                                    {item.erros.length}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <ul className="text-xs space-y-1">
                                    {item.erros.map((erro, i) => (
                                      <li key={i}>• {erro}</li>
                                    ))}
                                  </ul>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {dadosPreview.length > 100 && (
                  <div className="p-2 text-center text-xs text-muted-foreground border-t">
                    Mostrando 100 de {dadosPreview.length} registros
                  </div>
                )}
              </ScrollArea>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm text-muted-foreground">
                  {totalValidos > 0 ? (
                    <span>Pronto para importar <strong>{totalValidos}</strong> colaborador(es)</span>
                  ) : (
                    <span className="text-destructive">Nenhum registro válido para importar</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={limpar}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleImportar} 
                    disabled={totalValidos === 0 || importando}
                    className="gap-2"
                  >
                    {importando ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Importando...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Importar {totalValidos} Colaborador(es)
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Result */}
          {resultado && (
            <div className="space-y-4">
              <div className={cn(
                "p-6 rounded-lg text-center",
                resultado.sucesso > 0 ? "bg-success/10" : "bg-destructive/10"
              )}>
                {resultado.sucesso > 0 ? (
                  <CheckCircle2 className="w-12 h-12 mx-auto text-success mb-3" />
                ) : (
                  <AlertTriangle className="w-12 h-12 mx-auto text-destructive mb-3" />
                )}
                <h3 className="text-lg font-semibold mb-1">
                  {resultado.sucesso > 0 ? 'Importação Concluída!' : 'Falha na Importação'}
                </h3>
                <p className="text-muted-foreground">
                  {resultado.sucesso} de {resultado.total} colaboradores importados
                </p>
              </div>

              {resultado.erros > 0 && (
                <div className="p-4 bg-destructive/5 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    Erros ({resultado.erros})
                  </h4>
                  <ScrollArea className="max-h-32">
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      {resultado.detalhes.map((d, i) => (
                        <li key={i}>Linha {d.linha}: {d.erro}</li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={limpar}>
                  Nova Importação
                </Button>
                <Button onClick={handleClose}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});
