import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut, Download } from "lucide-react";

interface ImagePreviewModalProps { open: boolean; onOpenChange: (open: boolean) => void; src: string; alt?: string; onDownload?: () => void; }

export function ImagePreviewModal({ open, onOpenChange, src, alt, onDownload }: ImagePreviewModalProps) {
  const [zoom, setZoom] = React.useState(1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <Button variant="secondary" size="icon" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}><ZoomOut className="h-4 w-4" /></Button>
          <Button variant="secondary" size="icon" onClick={() => setZoom((z) => Math.min(3, z + 0.25))}><ZoomIn className="h-4 w-4" /></Button>
          {onDownload && <Button variant="secondary" size="icon" onClick={onDownload}><Download className="h-4 w-4" /></Button>}
        </div>
        <div className="overflow-auto max-h-[80vh]">
          <img src={src} alt={alt || "Preview"} className="w-full transition-transform" style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default ImagePreviewModal;
