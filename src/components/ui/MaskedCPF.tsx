import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface MaskedCPFProps { value: string; onChange: (value: string) => void; className?: string; }

export function MaskedCPF({ value, onChange, className }: MaskedCPFProps) {
  const mask = (v: string) => v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").slice(0, 14);
  return <Input value={mask(value)} onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))} placeholder="000.000.000-00" className={className} />;
}
export default MaskedCPF;
