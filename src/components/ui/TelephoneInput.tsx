import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";

interface TelephoneInputProps { value: string; onChange: (value: string) => void; className?: string; }

export function TelephoneInput({ value, onChange, className }: TelephoneInputProps) {
  const mask = (v: string) => { const d = v.replace(/\D/g, ""); if (d.length <= 10) return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2"); return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 15); };
  return (
    <div className={cn("relative", className)}>
      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input value={mask(value)} onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))} placeholder="(00) 00000-0000" className="pl-10" />
    </div>
  );
}
export default TelephoneInput;
