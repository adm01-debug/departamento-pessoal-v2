/**
 * @fileoverview Opções de exportação
 * @module components/export/ExportOptions
 */
import { memo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ExportOptionsProps { columns: { id: string; label: string }[]; selected: string[]; onChange: (selected: string[]) => void; }

export const ExportOptions = memo(function ExportOptions({ columns, selected, onChange }: ExportOptionsProps) {
  const toggle = (id: string) => {
    if (selected.includes(id)) onChange(selected.filter(s => s !== id));
    else onChange([...selected, id]);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Colunas para exportar</Label>
      <div className="grid grid-cols-2 gap-2">
        {columns.map(col => (
          <div key={col.id} className="flex items-center space-x-2">
            <Checkbox id={col.id} checked={selected.includes(col.id)} onCheckedChange={() => toggle(col.id)} />
            <Label htmlFor={col.id} className="text-sm cursor-pointer">{col.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
});
