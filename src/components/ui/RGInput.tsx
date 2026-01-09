import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RGInputProps { label?: string; value?: string; onChange?: (value: string) => void; required?: boolean; error?: string; disabled?: boolean; className?: string; }

export function RGInput({ label = "RG", value = "", onChange, required, error, disabled, className }: RGInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>}
      <Input value={value} onChange={(e) => onChange?.(e.target.value)} placeholder="00.000.000-0" maxLength={20} disabled={disabled} className={cn(error && "border-destructive")} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
export default RGInput;
