import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface MaskedPISProps { value: string; onChange: (value: string) => void; className?: string; }

export function MaskedPIS({ value, onChange, className }: MaskedPISProps) {
  const mask = (v: string) => v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{5})(\d)/, "$1.$2").replace(/(\d{5}\.)(\d{2})(\d)/, "$1$2-$3").slice(0, 14);
  return <Input value={mask(value)} onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))} placeholder="000.00000.00-0" className={className} />;
}
export default MaskedPIS;
