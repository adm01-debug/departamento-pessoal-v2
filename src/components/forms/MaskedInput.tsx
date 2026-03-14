import React from "react";
import { Input } from "@/components/ui/input";
import { masks } from "@/lib/masks";
interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> { mask: "cpf" | "cnpj" | "telefone" | "cep" | "moeda" | "data" | "hora" | "pis"; onValueChange?: (value: string) => void; }
export function MaskedInput({ mask, value, onChange, onValueChange, ...props }: MaskedInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const rawValue = e.target.value; const maskedValue = masks[mask](rawValue); e.target.value = maskedValue; onChange?.(e); onValueChange?.(rawValue.replace(/\D/g, "")); };
  const maskedValue = value ? masks[mask](String(value)) : "";
  return <Input {...props} value={maskedValue} onChange={handleChange} />;
}
export default MaskedInput;
