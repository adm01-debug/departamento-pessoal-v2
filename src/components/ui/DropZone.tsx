import React, { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

interface DropZoneProps { onDrop: (files: File[]) => void; accept?: string; multiple?: boolean; className?: string; }

export function DropZone({ onDrop, accept, multiple = false, className }: DropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(false); onDrop(Array.from(e.dataTransfer.files)); }, [onDrop]);
  return (
    <div className={cn("border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary", dragOver && "border-primary bg-primary/5", className)} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}>
      <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Arraste arquivos ou clique</p>
    </div>
  );
}
export default DropZone;
