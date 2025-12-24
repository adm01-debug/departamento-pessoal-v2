/**
 * @fileoverview Grupo de filtros
 * @module components/filter/FilterGroup
 */
import { memo } from 'react';
import { Label } from '@/components/ui/label';

interface FilterGroupProps { label: string; children: React.ReactNode; }

export const FilterGroup = memo(function FilterGroup({ label, children }: FilterGroupProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="space-y-2">{children}</div>
    </div>
  );
});
