import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface IDDocumentInputProps { value: string; onChange: (value: string) => void; className?: string; }

export function IDDocumentInput({ value, onChange, className }: IDDocumentInputProps) {
  return (
    <Input value={value} onChange={(e) => onChange(e.target.value.replace(/[^0-9X]/gi, "").toUpperCase())} placeholder="00.000.000-0" maxLength={12} className={className} />
  );
}
export default IDDocumentInput;
