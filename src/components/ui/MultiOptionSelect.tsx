import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

interface Option { value: string; label: string; }
interface MultiOptionSelectProps { options: Option[]; value: string[]; onChange: (value: string[]) => void; placeholder?: string; className?: string; }

export function MultiOptionSelect({ options, value, onChange, placeholder = "Selecione", className }: MultiOptionSelectProps) {
  const toggle = (v: string) => { if (value.includes(v)) onChange(value.filter((x) => x !== v)); else onChange([...value, v]); };
  return (
    <Popover>
      <PopoverTrigger asChild><Button variant="outline" className={cn("justify-between", className)}>{value.length > 0 ? `${value.length} selecionado(s)` : placeholder}<ChevronDown className="h-4 w-4 ml-2" /></Button></PopoverTrigger>
      <PopoverContent className="w-full p-2"><div className="space-y-2">{options.map((opt) => (<label key={opt.value} className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"><Checkbox checked={value.includes(opt.value)} onCheckedChange={() => toggle(opt.value)} />{opt.label}</label>))}</div></PopoverContent>
    </Popover>
  );
}
export default MultiOptionSelect;
