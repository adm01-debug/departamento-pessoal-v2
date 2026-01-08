import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Sun, Contrast, Droplet, Palette, RotateCcw, Download } from "lucide-react";

interface ImageFilterProps {
  src: string;
  className?: string;
  onSave?: (filteredImage: Blob) => void;
}

interface Filters {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  grayscale: number;
  sepia: number;
}

const defaultFilters: Filters = { brightness: 100, contrast: 100, saturation: 100, hue: 0, blur: 0, grayscale: 0, sepia: 0 };

export function ImageFilter({ src, className, onSave }: ImageFilterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const filterStyle = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) hue-rotate(${filters.hue}deg) blur(${filters.blur}px) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%)`;

  const updateFilter = (key: keyof Filters, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => { setFilters(defaultFilters); };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.filter = filterStyle;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => { if (blob) onSave?.(blob); }, "image/png");
    };
    img.src = src;
  };

  const presets = [
    { name: "Normal", filters: defaultFilters },
    { name: "Vintage", filters: { ...defaultFilters, sepia: 40, saturation: 80, contrast: 110 } },
    { name: "B&W", filters: { ...defaultFilters, grayscale: 100 } },
    { name: "Vivid", filters: { ...defaultFilters, saturation: 150, contrast: 120 } },
    { name: "Cool", filters: { ...defaultFilters, hue: 180, saturation: 80 } },
    { name: "Warm", filters: { ...defaultFilters, sepia: 20, saturation: 110 } },
  ];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <img src={src} alt="Preview" className="w-full h-full object-contain" style={{ filter: filterStyle }} />
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex gap-2 overflow-x-auto pb-2">
        {presets.map(preset => (
          <Button key={preset.name} variant={JSON.stringify(filters) === JSON.stringify(preset.filters) ? "default" : "outline"} size="sm" onClick={() => setFilters(preset.filters)}>{preset.name}</Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label className="flex items-center gap-2"><Sun className="h-4 w-4" />Brilho</Label><Slider value={[filters.brightness]} min={0} max={200} onValueChange={([v]) => updateFilter("brightness", v)} /></div>
        <div className="space-y-2"><Label className="flex items-center gap-2"><Contrast className="h-4 w-4" />Contraste</Label><Slider value={[filters.contrast]} min={0} max={200} onValueChange={([v]) => updateFilter("contrast", v)} /></div>
        <div className="space-y-2"><Label className="flex items-center gap-2"><Droplet className="h-4 w-4" />Saturação</Label><Slider value={[filters.saturation]} min={0} max={200} onValueChange={([v]) => updateFilter("saturation", v)} /></div>
        <div className="space-y-2"><Label className="flex items-center gap-2"><Palette className="h-4 w-4" />Matiz</Label><Slider value={[filters.hue]} min={0} max={360} onValueChange={([v]) => updateFilter("hue", v)} /></div>
      </div>
      <div className="flex justify-center gap-2">
        <Button variant="outline" onClick={resetFilters}><RotateCcw className="h-4 w-4 mr-1" />Resetar</Button>
        <Button variant="default" onClick={handleSave}><Download className="h-4 w-4 mr-1" />Salvar</Button>
      </div>
    </div>
  );
}
export default ImageFilter;
