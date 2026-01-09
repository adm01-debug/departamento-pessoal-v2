import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, ChevronsUpDown, User } from "lucide-react";

interface Employee { id: string; name: string; position?: string; avatar?: string; }
interface EmployeeSelectProps { employees: Employee[]; value?: string; onChange: (id: string) => void; placeholder?: string; disabled?: boolean; className?: string; }

export function EmployeeSelect({ employees, value, onChange, placeholder = "Selecionar funcionário", disabled, className }: EmployeeSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = employees.find((e) => e.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className={cn("w-full justify-between", className)} disabled={disabled}>
          {selected ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6"><AvatarImage src={selected.avatar} /><AvatarFallback>{selected.name[0]}</AvatarFallback></Avatar>
              <span>{selected.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar funcionário..." />
          <CommandList>
            <CommandEmpty>Nenhum funcionário encontrado.</CommandEmpty>
            <CommandGroup>
              {employees.map((emp) => (
                <CommandItem key={emp.id} value={emp.name} onSelect={() => { onChange(emp.id); setOpen(false); }}>
                  <Avatar className="h-6 w-6 mr-2"><AvatarImage src={emp.avatar} /><AvatarFallback>{emp.name[0]}</AvatarFallback></Avatar>
                  <div className="flex-1"><p>{emp.name}</p>{emp.position && <p className="text-xs text-muted-foreground">{emp.position}</p>}</div>
                  {value === emp.id && <Check className="h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
export default EmployeeSelect;
