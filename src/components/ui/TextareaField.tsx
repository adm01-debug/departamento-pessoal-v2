import React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TextareaFieldProps { label?: string; value?: string; onChange?: (value: string) => void; placeholder?: string; rows?: number; maxLength?: number; required?: boolean; error?: string; disabled?: boolean; className?: string; }

export function TextareaField({ label, value = "", onChange, placeholder, rows = 3, maxLength, required, error, disabled, className }: TextareaFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>}
      <Textarea value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} rows={rows} maxLength={maxLength} disabled={disabled} className={cn(error && "border-destructive")} />
      <div className="flex justify-between">
        {error && <p className="text-sm text-destructive">{error}</p>}
        {maxLength && <span className="text-xs text-muted-foreground ml-auto">{value.length}/{maxLength}</span>}
      </div>
    </div>
  );
}
export default TextareaField;
