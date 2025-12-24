/**
 * @fileoverview Filtro de status
 * @module components/filters/StatusFilter
 */
import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusFilterProps { options: { value: string; label: string; color?: string }[]; selected: string[]; onChange: (selected: string[]) => void; }

export const StatusFilter = memo(function StatusFilter({ options, selected, onChange }: StatusFilterProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) onChange(selected.filter(s => s !== value));
    else onChange([...selected, value]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <Badge key={opt.value} variant={selected.includes(opt.value) ? 'default' : 'outline'} className={cn('cursor-pointer', opt.color)} onClick={() => toggle(opt.value)}>
          {opt.label}
        </Badge>
      ))}
    </div>
  );
});
