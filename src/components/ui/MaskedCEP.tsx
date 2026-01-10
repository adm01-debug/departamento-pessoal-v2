import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface MaskedCEPProps { value: string; onChange: (value: string) => void; className?: string; }

export function MaskedCEP({ value, onChange, className }: MaskedCEPProps) {
  const mask = (v: string) => v.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
  return <Input value={mask(value)} onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))} placeholder="00000-000" className={className} />;
}
export default MaskedCEP;
