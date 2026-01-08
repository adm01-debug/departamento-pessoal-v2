import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, Check, X, Move } from "lucide-react";

interface ImageCropperProps {
  src: string;
  className?: string;
  aspectRatio?: number;
  minZoom?: number;
  maxZoom?: number;
  onCrop?: (croppedImage: Blob) => void;
  onCancel?: () => void;
}

export function ImageCropper({ src, className, aspectRatio = 1, minZoom = 1, maxZoom = 3, onCrop, onCancel }: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart]);

  const handleMouseUp = () => { setIsDragging(false); };

  const handleZoom = (value: number[]) => { setZoom(value[0]); };
  const rotateLeft = () => { setRotation(prev => prev - 90); };
  const rotateRight = () => { setRotation(prev => prev + 90); };

  const handleCrop = async () => {
    const container = containerRef.current;
    if (!container) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const size = Math.min(container.clientWidth, container.clientHeight);
      canvas.width = size;
      canvas.height = size / aspectRatio;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      ctx.drawImage(img, position.x, position.y, canvas.width, canvas.height);
      canvas.toBlob((blob) => { if (blob) onCrop?.(blob); }, "image/png");
    };
    img.src = src;
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div ref={containerRef} className="relative w-full aspect-square bg-black rounded-lg overflow-hidden cursor-move" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <img src={src} alt="Crop preview" className="absolute w-full h-full object-contain transition-transform" style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)` }} draggable={false} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-8 border-2 border-white/50 rounded-lg" style={{ aspectRatio }} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ZoomOut className="h-4 w-4 text-muted-foreground" />
        <Slider value={[zoom]} min={minZoom} max={maxZoom} step={0.1} onValueChange={handleZoom} className="flex-1" />
        <ZoomIn className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex justify-center gap-2">
        <Button variant="outline" size="icon" onClick={rotateLeft}><RotateCcw className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon" onClick={rotateRight}><RotateCw className="h-4 w-4" /></Button>
        <Button variant="outline" onClick={onCancel}><X className="h-4 w-4 mr-1" />Cancelar</Button>
        <Button variant="default" onClick={handleCrop}><Check className="h-4 w-4 mr-1" />Cortar</Button>
      </div>
    </div>
  );
}
export default ImageCropper;
