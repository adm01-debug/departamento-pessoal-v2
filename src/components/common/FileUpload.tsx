import React, { useRef, useState } from 'react';
import { Upload, X, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatBytes } from '@/utils/formatters';

interface Props {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  className?: string;
}

export function FileUpload({
  accept,
  maxSize = 10 * 1024 * 1024,
  multiple = false,
  onUpload,
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).filter((f) => f.size <= maxSize);
    setFiles((prev) => (multiple ? [...prev, ...newFiles] : newFiles));
    onUpload(multiple ? [...files, ...newFiles] : newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onUpload(newFiles);
  };

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
        dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
        className
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      <Upload className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
      <p className="mb-2">
        Arraste arquivos ou{' '}
        <button className="text-primary underline" onClick={() => inputRef.current?.click()}>
          clique aqui
        </button>
      </p>
      <p className="text-sm text-muted-foreground">Máx: {formatBytes(maxSize)}</p>
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-muted rounded">
              <div className="flex items-center gap-2">
                <File className="w-4 h-4" />
                <span className="text-sm">{f.name}</span>
                <span className="text-xs text-muted-foreground">({formatBytes(f.size)})</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeFile(i)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
