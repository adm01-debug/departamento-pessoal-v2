import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ColorPickerProps { value: string; onChange: (color: string) => void; presets?: string[]; className?: string; }

const defaultPresets = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280"];

export function ColorPicker({ value, onChange, presets = defaultPresets, className }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start gap-2", className)}>
          <div className="h-4 w-4 rounded border" style={{ backgroundColor: value }} />
          {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-3">
          <Input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-24 w-full cursor-pointer" />
          <div className="grid grid-cols-8 gap-1">
            {presets.map((color) => (
              <button key={color} className="h-6 w-6 rounded border cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: color }} onClick={() => onChange(color)} />
            ))}
          </div>
          <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="#000000" />
        </div>
      </PopoverContent>
    </Popover>
  );
}
export default ColorPicker;
