import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CTSPInputProps { label?: string; value?: string; onChange?: (value: string) => void; required?: boolean; error?: string; disabled?: boolean; className?: string; }

export function CTSPInput({ label = "CTPS", value = "", onChange, required, error, disabled, className }: CTSPInputProps) {
  const formatCTPS = (val: string) => val.replace(/\D/g, "").slice(0, 11).replace(/(\d{7})(\d{4})/, "$1/$2");

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>}
      <Input value={formatCTPS(value)} onChange={(e) => onChange?.(e.target.value.replace(/\D/g, ""))} placeholder="0000000/0000" maxLength={12} disabled={disabled} className={cn(error && "border-destructive")} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
export default CTSPInput;
