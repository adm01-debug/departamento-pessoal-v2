import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface ImageEditor { src: string; onSave: (data: string) => void; className?: string; }

export function ImageEditor({ src, onSave, className }: ImageEditor) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative overflow-hidden rounded-lg border aspect-square">
        <img src={src} alt="Edit" className="w-full h-full object-cover" style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }} />
      </div>
      <div className="flex justify-center gap-2">
        <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}><ZoomOut className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(3, zoom + 0.1))}><ZoomIn className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon" onClick={() => setRotation((rotation + 90) % 360)}><RotateCw className="h-4 w-4" /></Button>
      </div>
      <Button className="w-full" onClick={() => onSave(src)}>Aplicar</Button>
    </div>
  );
}
export default ImageEditor;
