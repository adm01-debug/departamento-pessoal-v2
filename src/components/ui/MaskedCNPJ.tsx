import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface MaskedCNPJProps { value: string; onChange: (value: string) => void; className?: string; }

export function MaskedCNPJ({ value, onChange, className }: MaskedCNPJProps) {
  const mask = (v: string) => v.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2").slice(0, 18);
  return <Input value={mask(value)} onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))} placeholder="00.000.000/0000-00" className={className} />;
}
export default MaskedCNPJ;
