import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

interface Address {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface AddressInputProps {
  value?: Partial<Address>;
  onChange?: (address: Partial<Address>) => void;
  className?: string;
  disabled?: boolean;
}

export function AddressInput({ value = {}, onChange, className, disabled = false }: AddressInputProps) {
  const [isSearching, setIsSearching] = useState(false);

  const handleChange = (field: keyof Address, fieldValue: string) => {
    onChange?.({ ...value, [field]: fieldValue });
  };

  const handleCepSearch = async () => {
    if (!value.cep || value.cep.length < 8) return;
    setIsSearching(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${value.cep.replace(/\D/g, "")}/json/`);
      const data = await response.json();
      if (!data.erro) {
        onChange?.({ ...value, logradouro: data.logradouro, bairro: data.bairro, cidade: data.localidade, estado: data.uf });
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2">
        <div className="w-40">
          <Label>CEP</Label>
          <div className="flex gap-1">
            <Input value={value.cep || ""} onChange={(e) => handleChange("cep", e.target.value)} placeholder="00000-000" disabled={disabled} />
            <Button type="button" variant="outline" size="icon" onClick={handleCepSearch} disabled={disabled || isSearching}>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2"><Label>Logradouro</Label><Input value={value.logradouro || ""} onChange={(e) => handleChange("logradouro", e.target.value)} disabled={disabled} /></div>
        <div><Label>Número</Label><Input value={value.numero || ""} onChange={(e) => handleChange("numero", e.target.value)} disabled={disabled} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Complemento</Label><Input value={value.complemento || ""} onChange={(e) => handleChange("complemento", e.target.value)} disabled={disabled} /></div>
        <div><Label>Bairro</Label><Input value={value.bairro || ""} onChange={(e) => handleChange("bairro", e.target.value)} disabled={disabled} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Cidade</Label><Input value={value.cidade || ""} onChange={(e) => handleChange("cidade", e.target.value)} disabled={disabled} /></div>
        <div><Label>Estado</Label><Input value={value.estado || ""} onChange={(e) => handleChange("estado", e.target.value)} maxLength={2} disabled={disabled} /></div>
      </div>
    </div>
  );
}
export default AddressInput;
