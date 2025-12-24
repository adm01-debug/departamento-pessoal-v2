/**
 * @fileoverview Lista de ações
 * @module components/lists/ActionList
 */
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface ActionListProps { items: { id: string; label: string; icon?: React.ReactNode; onClick: () => void }[]; }

export const ActionList = memo(function ActionList({ items }: ActionListProps) {
  return (
    <div className="space-y-1">
      {items.map(item => (
        <Button key={item.id} variant="ghost" className="w-full justify-between" onClick={item.onClick}>
          <span className="flex items-center gap-2">{item.icon}{item.label}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
});
