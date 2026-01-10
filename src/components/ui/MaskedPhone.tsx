import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface MaskedPhoneProps { value: string; onChange: (value: string) => void; className?: string; }

export function MaskedPhone({ value, onChange, className }: MaskedPhoneProps) {
  const mask = (v: string) => { const d = v.replace(/\D/g, ""); if (d.length <= 10) return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2"); return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 15); };
  return <Input value={mask(value)} onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))} placeholder="(00) 00000-0000" className={className} />;
}
export default MaskedPhone;
