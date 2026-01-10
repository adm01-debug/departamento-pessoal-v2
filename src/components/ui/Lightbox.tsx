import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface LightboxProps { src: string; alt?: string; open: boolean; onClose: () => void; }

export function Lightbox({ src, alt, open, onClose }: LightboxProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={onClose}>
      <button className="absolute top-4 right-4 text-white" onClick={onClose}><X className="h-6 w-6" /></button>
      <img src={src} alt={alt} className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
    </div>
  );
}
export default Lightbox;
