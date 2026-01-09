import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon, Plus, X } from "lucide-react";

interface SpeedDialAction { icon: LucideIcon; label: string; onClick: () => void; }
interface SpeedDialProps { actions: SpeedDialAction[]; className?: string; }

export function SpeedDial({ actions, className }: SpeedDialProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("fixed bottom-6 right-6 flex flex-col-reverse items-center gap-2", className)}>
      {open && actions.map((action, i) => {
        const Icon = action.icon;
        return (
          <Button key={i} variant="secondary" size="icon" className="h-12 w-12 rounded-full shadow-md animate-in fade-in slide-in-from-bottom-2" onClick={() => { action.onClick(); setOpen(false); }}>
            <Icon className="h-5 w-5" />
          </Button>
        );
      })}
      <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" onClick={() => setOpen(!open)}>
        {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  );
}
export default SpeedDial;
