import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextFieldProps { label?: string; value?: string; onChange?: (value: string) => void; placeholder?: string; type?: string; required?: boolean; error?: string; hint?: string; disabled?: boolean; className?: string; }

export function TextField({ label, value, onChange, placeholder, type = "text", required, error, hint, disabled, className }: TextFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>}
      <Input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} disabled={disabled} className={cn(error && "border-destructive")} />
      {hint && !error && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
export default TextField;
