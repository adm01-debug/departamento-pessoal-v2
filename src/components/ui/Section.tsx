import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  variant?: "default" | "card" | "bordered";
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Section({ title, description, actions, variant = "default", collapsible = false, defaultCollapsed = false, className, children }: SectionProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  if (variant === "card") {
    return (
      <Card className={className}>
        {(title || description || actions) && (
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {actions}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    );
  }

  return (
    <section className={cn("space-y-4", className)}>
      {(title || description || actions) && (
        <div className="flex items-center justify-between">
          <div>
            {title && <h2 className="text-lg font-semibold" onClick={() => collapsible && setIsCollapsed(!isCollapsed)}>{title}</h2>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {(!collapsible || !isCollapsed) && (
        <div className={cn(variant === "bordered" && "border rounded-lg p-4")}>{children}</div>
      )}
    </section>
  );
}
export default Section;
