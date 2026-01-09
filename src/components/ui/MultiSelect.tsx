import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";

interface MultiSelectOption { value: string; label: string; }

interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  maxDisplay?: number;
}

export function MultiSelect({ options, value = [], onChange, placeholder = "Selecione...", className, maxDisplay = 3 }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.filter((opt) => value.includes(opt.value));

  const toggle = (optValue: string) => {
    const newValue = value.includes(optValue) ? value.filter((v) => v !== optValue) : [...value, optValue];
    onChange?.(newValue);
  };

  const remove = (optValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(value.filter((v) => v !== optValue));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className={cn("w-full justify-between h-auto min-h-10", className)}>
          <div className="flex flex-wrap gap-1">
            {selected.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            {selected.slice(0, maxDisplay).map((opt) => (
              <Badge key={opt.value} variant="secondary" className="gap-1">
                {opt.label}
                <X className="h-3 w-3 cursor-pointer" onClick={(e) => remove(opt.value, e)} />
              </Badge>
            ))}
            {selected.length > maxDisplay && <Badge variant="secondary">+{selected.length - maxDisplay}</Badge>}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandList>
            <CommandEmpty>Nenhum resultado.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem key={opt.value} onSelect={() => toggle(opt.value)}>
                  <Check className={cn("mr-2 h-4 w-4", value.includes(opt.value) ? "opacity-100" : "opacity-0")} />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
export default MultiSelect;
