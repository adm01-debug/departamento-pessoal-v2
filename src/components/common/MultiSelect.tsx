/**
 * @fileoverview Multi-select
 * @module components/common/MultiSelect
 */
import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option { value: string; label: string; }
interface MultiSelectProps { options: Option[]; value: string[]; onChange: (value: string[]) => void; placeholder?: string; }

export const MultiSelect = memo(function MultiSelect({ options, value, onChange, placeholder = 'Selecione...' }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const toggle = (v: string) => onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  const selected = options.filter(o => value.includes(o.value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selected.length > 0 ? (
            <div className="flex gap-1 flex-wrap">{selected.slice(0, 2).map(s => <Badge key={s.value} variant="secondary">{s.label}</Badge>)}{selected.length > 2 && <Badge variant="secondary">+{selected.length - 2}</Badge>}</div>
          ) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandEmpty>Nenhum resultado.</CommandEmpty>
          <CommandGroup>
            {options.map(opt => (
              <CommandItem key={opt.value} onSelect={() => toggle(opt.value)}>
                <Check className={cn('mr-2 h-4 w-4', value.includes(opt.value) ? 'opacity-100' : 'opacity-0')} />{opt.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
