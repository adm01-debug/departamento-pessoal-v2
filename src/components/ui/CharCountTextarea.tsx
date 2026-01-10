import React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface CharCountTextareaProps { value: string; onChange: (value: string) => void; maxLength: number; placeholder?: string; className?: string; }

export function CharCountTextarea({ value, onChange, maxLength, placeholder, className }: CharCountTextareaProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <Textarea value={value} onChange={(e) => onChange(e.target.value.slice(0, maxLength))} placeholder={placeholder} />
      <p className={cn("text-xs text-right", value.length >= maxLength ? "text-destructive" : "text-muted-foreground")}>{value.length}/{maxLength}</p>
    </div>
  );
}
export default CharCountTextarea;
