import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface ChipInputProps { value: string[]; onChange: (tags: string[]) => void; placeholder?: string; className?: string; }

export function ChipInput({ value, onChange, placeholder = "Adicionar...", className }: ChipInputProps) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) { e.preventDefault(); if (!value.includes(input.trim())) onChange([...value, input.trim()]); setInput(""); }
    if (e.key === "Backspace" && !input && value.length) onChange(value.slice(0, -1));
  };

  return (
    <div className={cn("flex flex-wrap gap-2 p-2 border rounded-md focus-within:ring-2 focus-within:ring-ring", className)}>
      {value.map((tag) => <Badge key={tag} variant="secondary" className="gap-1">{tag}<button onClick={() => onChange(value.filter((t) => t !== tag))}><X className="h-3 w-3" /></button></Badge>)}
      <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder} className="flex-1 min-w-[100px] border-0 p-0 focus-visible:ring-0" />
    </div>
  );
}
export default ChipInput;
