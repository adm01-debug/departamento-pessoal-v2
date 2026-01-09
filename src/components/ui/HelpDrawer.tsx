import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { HelpCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HelpSection { title: string; content: string; link?: string; }
interface HelpDrawerProps { open: boolean; onOpenChange: (open: boolean) => void; title?: string; sections: HelpSection[]; }

export function HelpDrawer({ open, onOpenChange, title = "Ajuda", sections }: HelpDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><HelpCircle className="h-4 w-4" />{title}</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-6">
          {sections.map((section, i) => (
            <div key={i}>
              <h3 className="font-medium mb-2">{section.title}</h3>
              <p className="text-sm text-muted-foreground">{section.content}</p>
              {section.link && <Button variant="link" className="p-0 h-auto mt-2" onClick={() => window.open(section.link, "_blank")}>Saiba mais <ExternalLink className="h-3 w-3 ml-1" /></Button>}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
export default HelpDrawer;
