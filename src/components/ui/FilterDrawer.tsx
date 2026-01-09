import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

interface FilterDrawerProps { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode; onApply: () => void; onClear: () => void; }

export function FilterDrawer({ open, onOpenChange, children, onApply, onClear }: FilterDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[350px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><Filter className="h-4 w-4" />Filtros</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-4">{children}</div>
        <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
          <Button variant="outline" onClick={onClear}><X className="h-4 w-4 mr-1" />Limpar</Button>
          <Button onClick={() => { onApply(); onOpenChange(false); }}>Aplicar Filtros</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
export default FilterDrawer;
