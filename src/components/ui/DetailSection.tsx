import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DetailSectionProps { title: string; children: React.ReactNode; defaultOpen?: boolean; className?: string; }

export function DetailSection({ title, children, defaultOpen = true, className }: DetailSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={cn("border rounded-lg", className)}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 h-auto">
          <span className="font-medium">{title}</span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4 pt-0 border-t">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
export default DetailSection;
