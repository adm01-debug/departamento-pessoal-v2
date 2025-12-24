/**
 * @fileoverview Drawer de filtros
 * @module components/filter/FilterDrawer
 */
import { memo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface FilterDrawerProps { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode; onApply: () => void; onClear: () => void; }

export const FilterDrawer = memo(function FilterDrawer({ open, onOpenChange, children, onApply, onClear }: FilterDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader><SheetTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />Filtros</SheetTitle></SheetHeader>
        <div className="py-4 space-y-4">{children}</div>
        <SheetFooter className="flex gap-2">
          <Button variant="outline" onClick={onClear}><X className="h-4 w-4 mr-2" />Limpar</Button>
          <Button onClick={() => { onApply(); onOpenChange(false); }}>Aplicar Filtros</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
});
