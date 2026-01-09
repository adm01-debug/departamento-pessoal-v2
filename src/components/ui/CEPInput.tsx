import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface CEPInputProps { label?: string; value?: string; onChange?: (value: string) => void; onAddressFound?: (address: any) => void; required?: boolean; error?: string; disabled?: boolean; className?: string; }

export function CEPInput({ label = "CEP", value = "", onChange, onAddressFound, required, error, disabled, className }: CEPInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const formatCEP = (val: string) => val.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d{1,3})/, "$1-$2");

  const searchCEP = async () => {
    const cep = value.replace(/\D/g, "");
    if (cep.length !== 8) return;
    setIsLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) onAddressFound?.(data);
    } finally { setIsLoading(false); }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}{required && <span className="text-destructive ml-1">*</span>}</Label>}
      <div className="flex gap-2">
        <Input value={formatCEP(value)} onChange={(e) => onChange?.(e.target.value.replace(/\D/g, ""))} placeholder="00000-000" maxLength={9} disabled={disabled} className={cn(error && "border-destructive")} />
        {onAddressFound && <Button type="button" variant="outline" size="icon" onClick={searchCEP} disabled={disabled || isLoading}>{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}</Button>}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
export default CEPInput;
