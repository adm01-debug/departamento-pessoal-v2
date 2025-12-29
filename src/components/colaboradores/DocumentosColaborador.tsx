import { useState, useRef, memo } from 'react';
import { FileText, Upload, Trash2, Download, Loader2, File, Image, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useDocumentosColaborador, getTiposDocumento, getTipoLabel, DocumentoColaborador } from '@/hooks/useDocumentosColaborador';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DocumentosColaboradorProps {
  colaboradorId: string;
  colaboradorNome?: string;
}

const formatBytes = (bytes: number | null): string => {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext ?? '')) {
    return <Image className="w-5 h-5 text-blue-500" />;
  }
  if (['pdf'].includes(ext ?? '')) {
    return <FileText className="w-5 h-5 text-red-500" />;
  }
  if (['doc', 'docx'].includes(ext ?? '')) {
    return <FileSpreadsheet className="w-5 h-5 text-blue-600" />;
  }
  return <File className="w-5 h-5 text-muted-foreground" />;
};

export const DocumentosColaborador = memo(function DocumentosColaborador({ colaboradorId, colaboradorNome }: DocumentosColaboradorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<DocumentoColaborador | null>(null);
  
  const { 
    documentos, 
    isLoading, 
    uploading, 
    uploadDocumento, 
    deleteDocumento, 
    downloadDocumento,
    isDeleting 
  } = useDocumentosColaborador(colaboradorId);

  const tiposDocumento = getTiposDocumento();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!selectedTipo) {
      return;
    }

    await uploadDocumento(file, selectedTipo);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedTipo('');
  };

  const handleUploadClick = () => {
    if (!selectedTipo) {
      return;
    }
    fileInputRef.current?.click();
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      deleteDocumento(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <div className="p-4 rounded-lg border border-dashed border-border bg-muted/30">
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedTipo} onValueChange={setSelectedTipo}>
            <SelectTrigger className="w-full sm:w-[200px] bg-background">
              <SelectValue placeholder="Tipo de documento" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
              {tiposDocumento.map(tipo => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
            onChange={handleFileSelect}
          />
          
          <Button 
            onClick={handleUploadClick} 
            disabled={!selectedTipo || uploading}
            className="gap-2"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading ? 'Enviando...' : 'Selecionar Arquivo'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Formatos aceitos: PDF, JPG, PNG, WEBP, DOC, DOCX (máx. 10MB)
        </p>
      </div>

      {/* Documents List */}
      {documentos.length === 0 ? (
        <div className="text-center py-8 bg-card rounded-lg border border-border">
          <FileText className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum documento enviado</p>
          <p className="text-xs text-muted-foreground mt-1">
            Selecione o tipo e faça upload dos documentos do colaborador
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {documentos.map(doc => (
            <div 
              key={doc.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
            >
              {getFileIcon(doc.nome_arquivo)}
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{doc.nome_arquivo}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-muted">{getTipoLabel(doc.tipo)}</span>
                  <span>{formatBytes(doc.tamanho_bytes)}</span>
                  <span>•</span>
                  <span>{format(new Date(doc.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => downloadDocumento(doc)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDeleteConfirm(doc)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir documento?</AlertDialogTitle>
            <AlertDialogDescription>
              O documento "{deleteConfirm?.nome_arquivo}" será excluído permanentemente. 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});
