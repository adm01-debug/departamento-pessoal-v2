import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react";

interface FormSectionProps { title: string; description?: string; icon?: LucideIcon; children: React.ReactNode; collapsible?: boolean; defaultOpen?: boolean; badge?: string; required?: boolean; error?: boolean; className?: string; }

export function FormSection({ title, description, icon: Icon, children, collapsible = false, defaultOpen = true, badge, required = false, error = false, className }: FormSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && <Icon className={cn("h-5 w-5", error ? "text-destructive" : "text-muted-foreground")} />}
        <div>
          <CardTitle className={cn("text-base", error && "text-destructive")}>{title}{required && <span className="text-destructive ml-1">*</span>}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {badge && <Badge variant={error ? "destructive" : "secondary"}>{badge}</Badge>}
        {collapsible && <Button variant="ghost" size="icon" className="h-8 w-8">{isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</Button>}
      </div>
    </div>
  );

  if (collapsible) {
    return (
      <Card className={cn(error && "border-destructive", className)}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild><CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">{header}</CardHeader></CollapsibleTrigger>
          <CollapsibleContent><CardContent>{children}</CardContent></CollapsibleContent>
        </Collapsible>
      </Card>
    );
  }

  return <Card className={cn(error && "border-destructive", className)}><CardHeader>{header}</CardHeader><CardContent>{children}</CardContent></Card>;
}
export default FormSection;
