import { memo } from "react";
import { Upload } from "lucide-react";
interface DropZoneProps { onDrop: (files: FileList) => void; accept?: string; }
export const DropZone = memo(function DropZone({ onDrop, accept }: DropZoneProps) {
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); if (e.dataTransfer.files) onDrop(e.dataTransfer.files); };
  return (
    <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-sm text-muted-foreground">Arraste arquivos aqui ou clique para selecionar</p>
      <input type="file" accept={accept} onChange={e => e.target.files && onDrop(e.target.files)} className="hidden" />
    </div>
  );
});
