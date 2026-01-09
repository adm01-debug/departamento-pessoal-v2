import React, { useState, useRef, DragEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Upload, File, X, Image, FileText } from "lucide-react";

interface FileDropzoneProps {
  onFilesSelected?: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
}

export function FileDropzone({ onFilesSelected, accept, maxFiles = 5, maxSize = 10 * 1024 * 1024, className, disabled = false }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDragIn = (e: DragEvent) => { handleDrag(e); setIsDragging(true); };
  const handleDragOut = (e: DragEvent) => { handleDrag(e); setIsDragging(false); };

  const handleDrop = (e: DragEvent) => {
    handleDrag(e);
    setIsDragging(false);
    if (disabled) return;
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.size <= maxSize).slice(0, maxFiles - files.length);
    addFiles(droppedFiles);
  };

  const addFiles = (newFiles: File[]) => {
    const updated = [...files, ...newFiles].slice(0, maxFiles);
    setFiles(updated);
    onFilesSelected?.(updated);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesSelected?.(updated);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className={cn("border-2 border-dashed rounded-lg p-6 text-center transition-colors", isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25", disabled && "opacity-50 cursor-not-allowed")} onDragEnter={handleDragIn} onDragLeave={handleDragOut} onDragOver={handleDrag} onDrop={handleDrop}>
        <input ref={inputRef} type="file" accept={accept} multiple={maxFiles > 1} className="hidden" onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))} disabled={disabled} />
        <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Arraste arquivos aqui ou</p>
        <Button variant="link" className="p-0" onClick={() => inputRef.current?.click()} disabled={disabled}>clique para selecionar</Button>
        <p className="text-xs text-muted-foreground mt-1">Máx: {maxFiles} arquivos, {(maxSize / 1024 / 1024).toFixed(0)}MB cada</p>
      </div>
      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((file, i) => (
            <li key={i} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
              {getFileIcon(file)}
              <span className="flex-1 truncate">{file.name}</span>
              <span className="text-muted-foreground">{(file.size / 1024).toFixed(0)}KB</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(i)}><X className="h-3 w-3" /></Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default FileDropzone;
