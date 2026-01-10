import React from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ColorSelectorProps { value: string; onChange: (color: string) => void; presets?: string[]; className?: string; }
const defaultPresets = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280"];

export function ColorSelector({ value, onChange, presets = defaultPresets, className }: ColorSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild><Button variant="outline" className={cn("w-10 h-10 p-0", className)} style={{ backgroundColor: value }} /></PopoverTrigger>
      <PopoverContent className="w-auto">
        <div className="grid grid-cols-4 gap-2 mb-2">{presets.map((color) => <button key={color} className="h-8 w-8 rounded-md border" style={{ backgroundColor: color }} onClick={() => onChange(color)} />)}</div>
        <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="#000000" />
      </PopoverContent>
    </Popover>
  );
}
export default ColorSelector;
