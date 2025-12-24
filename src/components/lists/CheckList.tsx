/**
 * @fileoverview Lista de checklist
 * @module components/lists/CheckList
 */
import { memo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CheckListProps { items: { id: string; label: string; checked: boolean }[]; onChange: (id: string, checked: boolean) => void; }

export const CheckList = memo(function CheckList({ items, onChange }: CheckListProps) {
  return (
    <div className="space-y-2">
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-2">
          <Checkbox id={item.id} checked={item.checked} onCheckedChange={c => onChange(item.id, !!c)} />
          <Label htmlFor={item.id} className="cursor-pointer">{item.label}</Label>
        </div>
      ))}
    </div>
  );
});
