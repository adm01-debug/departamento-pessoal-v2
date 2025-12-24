/**
 * @fileoverview Upload de documentos
 * @module components/documentos/DocumentoUpload
 */
import { memo, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, File, CheckCircle } from 'lucide-react';

interface FileUpload {
  file: File;
  progress: number;
  status: 'uploading' | 'done' | 'error';
}

interface DocumentoUploadProps {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  onUpload?: (files: File[]) => Promise<void>;
  categoria?: string;
}

/**
 * Componente de upload com drag and drop
 */
export const DocumentoUpload = memo(function DocumentoUpload({
  accept = '.pdf,.doc,.docx,.jpg,.png', maxSize = 10, multiple = true, onUpload
}: DocumentoUploadProps) {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(async (newFiles: FileList) => {
    const validFiles = Array.from(newFiles).filter(f => f.size <= maxSize * 1024 * 1024);
    const uploads = validFiles.map(file => ({ file, progress: 0, status: 'uploading' as const }));
    setFiles(prev => [...prev, ...uploads]);

    for (let i = 0; i < uploads.length; i++) {
      for (let p = 0; p <= 100; p += 20) {
        await new Promise(r => setTimeout(r, 100));
        setFiles(prev => prev.map((f, idx) => idx === prev.length - uploads.length + i ? { ...f, progress: p } : f));
      }
      setFiles(prev => prev.map((f, idx) => idx === prev.length - uploads.length + i ? { ...f, status: 'done' } : f));
    }

    if (onUpload) await onUpload(validFiles);
  }, [maxSize, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragActive ? 'border-primary bg-primary/5' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input id="file-upload" type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Arraste arquivos ou clique para selecionar</p>
        <p className="text-xs text-muted-foreground mt-1">Máximo {maxSize}MB • {accept}</p>
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <Card key={i}>
              <CardContent className="p-3 flex items-center gap-3">
                <File className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{f.file.name}</p>
                  {f.status === 'uploading' && <Progress value={f.progress} className="h-1 mt-1" />}
                </div>
                {f.status === 'done' && <CheckCircle className="h-4 w-4 text-green-500" />}
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(i)}><X className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
});
