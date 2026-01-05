import React, { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
interface FileUploadProps { accept?: string; multiple?: boolean; maxSize?: number; onUpload?: (files: File[]) => void; className?: string; }
export function FileUpload({ accept, multiple = false, maxSize = 10 * 1024 * 1024, onUpload, className }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragActive(false); const newFiles = Array.from(e.dataTransfer.files).filter(f => f.size <= maxSize); setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles); onUpload?.(newFiles); }, [maxSize, multiple, onUpload]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (!e.target.files) return; const newFiles = Array.from(e.target.files).filter(f => f.size <= maxSize); setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles); onUpload?.(newFiles); };
  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));
  return (
    <div className={cn("space-y-3", className)}><div className={cn("border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors", dragActive ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground")} onDragOver={e => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={handleDrop} onClick={() => document.getElementById("file-input")?.click()}><Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" /><p className="text-sm text-muted-foreground">Arraste arquivos ou clique para selecionar</p><input id="file-input" type="file" accept={accept} multiple={multiple} onChange={handleChange} className="hidden" /></div>{files.length > 0 && <div className="space-y-2">{files.map((file, i) => <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded-lg">{file.type.startsWith("image/") ? <Image className="h-4 w-4" /> : <FileText className="h-4 w-4" />}<span className="text-sm flex-1 truncate">{file.name}</span><span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)}KB</span><Button size="icon" variant="ghost" onClick={() => removeFile(i)}><X className="h-4 w-4" /></Button></div>)}</div>}</div>
  );
}
export default FileUpload;
