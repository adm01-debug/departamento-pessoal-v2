/**
 * @fileoverview Lista de seleção
 * @module components/lists/SelectList
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface SelectListProps { items: { id: string; label: string; description?: string }[]; selected: string | null; onSelect: (id: string) => void; }

export const SelectList = memo(function SelectList({ items, selected, onSelect }: SelectListProps) {
  return (
    <div className="space-y-1">
      {items.map(item => (
        <button key={item.id} onClick={() => onSelect(item.id)} className={cn('w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors', selected === item.id ? 'bg-primary/10 border border-primary' : 'hover:bg-muted border border-transparent')}>
          <div><p className="font-medium">{item.label}</p>{item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}</div>
          {selected === item.id && <Check className="h-5 w-5 text-primary" />}
        </button>
      ))}
    </div>
  );
});
