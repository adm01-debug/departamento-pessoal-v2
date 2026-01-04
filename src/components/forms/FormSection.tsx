import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react";

interface FormSectionProps { title: string; description?: string; icon?: LucideIcon; children: React.ReactNode; collapsible?: boolean; defaultOpen?: boolean; className?: string; columns?: 1 | 2 | 3 | 4; }

export function FormSection({ title, description, icon: Icon, children, collapsible = false, defaultOpen = true, className, columns = 1 }: FormSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const gridClass = { 1: "grid-cols-1", 2: "grid-cols-1 md:grid-cols-2", 3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", 4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" };
  const content = <div className={cn("grid gap-4", gridClass[columns])}>{children}</div>;
  
  if (collapsible) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
        <Card>
          <CardHeader className="pb-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                <div className="flex items-center gap-2">{Icon && <Icon className="h-5 w-5 text-muted-foreground" />}<div className="text-left"><CardTitle className="text-base">{title}</CardTitle>{description && <CardDescription>{description}</CardDescription>}</div></div>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent><CardContent className="pt-0">{content}</CardContent></CollapsibleContent>
        </Card>
      </Collapsible>
    );
  }
  return (
    <Card className={className}>
      <CardHeader className="pb-3"><div className="flex items-center gap-2">{Icon && <Icon className="h-5 w-5 text-muted-foreground" />}<div><CardTitle className="text-base">{title}</CardTitle>{description && <CardDescription>{description}</CardDescription>}</div></div></CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
export default FormSection;
