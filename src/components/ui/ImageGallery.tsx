import React from "react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps { images: { src: string; alt?: string }[]; columns?: 2 | 3 | 4; onSelect?: (index: number) => void; className?: string; }

export function ImageGallery({ images, columns = 3, onSelect, className }: ImageGalleryProps) {
  const cols = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };
  return (
    <div className={cn("grid gap-2", cols[columns], className)}>
      {images.map((img, i) => <img key={i} src={img.src} alt={img.alt || ""} className="w-full aspect-square object-cover rounded cursor-pointer hover:opacity-90" onClick={() => onSelect?.(i)} />)}
    </div>
  );
}
export default ImageGallery;
