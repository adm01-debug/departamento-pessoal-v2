import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Settings } from "lucide-react";

interface SettingsDrawerProps { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode; }

export function SettingsDrawer({ open, onOpenChange, children }: SettingsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><Settings className="h-4 w-4" />Configurações</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
export default SettingsDrawer;
