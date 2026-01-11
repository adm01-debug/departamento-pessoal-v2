// V15-185: src/components/ui/file-upload.tsx
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, File, Image } from 'lucide-react';
import { Button } from './button';

interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  onUpload?: (files: File[]) => void;
  className?: string;
}

export function FileUpload({ accept, maxSize = 10485760, multiple = false, onUpload, className }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const validFiles = Array.from(newFiles).filter(f => f.size <= maxSize);
    const updated = multiple ? [...files, ...validFiles] : validFiles.slice(0, 1);
    setFiles(updated);
    onUpload?.(updated);
  }, [files, maxSize, multiple, onUpload]);

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onUpload?.(updated);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn('border-2 border-dashed rounded-lg p-8 text-center transition-colors', dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25')}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">Arraste arquivos aqui ou</p>
        <label>
          <input type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          <Button type="button" variant="outline" size="sm" asChild><span>Selecionar arquivos</span></Button>
        </label>
        <p className="text-xs text-muted-foreground mt-2">Máximo {(maxSize / 1048576).toFixed(0)}MB</p>
      </div>
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, i) => (
            <li key={i} className="flex items-center gap-2 p-2 bg-muted rounded">
              {file.type.startsWith('image/') ? <Image className="h-4 w-4" /> : <File className="h-4 w-4" />}
              <span className="flex-1 text-sm truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)}KB</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(i)}><X className="h-4 w-4" /></Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
