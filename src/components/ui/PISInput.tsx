import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PISInputProps { label?: string; value?: string; onChange?: (value: string) => void; required?: boolean; error?: string; disabled?: boolean; className?: string; }

export function PISInput({ label = "PIS/PASEP", value = "", onChange, required, error, disabled, className }: PISInputProps) {
  const formatPIS = (val: string) => val.replace(/\D/g, "").slice(0, 11).replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, "$1.$2.$3-$4").replace(/(\d{3})(\d{5})(\d{1,2})/, "$1.$2.$3").replace(/(\d{3})(\d{1,5})/, "$1.$2");

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>}
      <Input value={formatPIS(value)} onChange={(e) => onChange?.(e.target.value.replace(/\D/g, ""))} placeholder="000.00000.00-0" maxLength={14} disabled={disabled} className={cn(error && "border-destructive")} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
export default PISInput;
