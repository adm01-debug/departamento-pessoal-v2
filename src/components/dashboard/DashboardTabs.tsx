import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface TabItem { id: string; label: string; icon?: LucideIcon; badge?: number; disabled?: boolean; content: React.ReactNode; }
interface DashboardTabsProps { tabs: TabItem[]; defaultTab?: string; onChange?: (id: string) => void; className?: string; contentClassName?: string; variant?: "default" | "pills" | "underline"; }

export function DashboardTabs({ tabs, defaultTab, onChange, className, contentClassName, variant = "default" }: DashboardTabsProps) {
  const listClass = variant === "pills" ? "bg-muted p-1 rounded-lg" : variant === "underline" ? "border-b" : "";
  const triggerClass = variant === "pills" ? "data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md" : "";
  return (
    <Tabs defaultValue={defaultTab || tabs[0]?.id} onValueChange={onChange} className={cn("", className)}>
      <TabsList className={cn("", listClass)}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <TabsTrigger key={tab.id} value={tab.id} disabled={tab.disabled} className={cn("", triggerClass)}>
              {Icon && <Icon className="h-4 w-4 mr-2" />}{tab.label}
              {tab.badge !== undefined && tab.badge > 0 && <Badge variant="secondary" className="ml-2">{tab.badge}</Badge>}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabs.map(tab => <TabsContent key={tab.id} value={tab.id} className={contentClassName}>{tab.content}</TabsContent>)}
    </Tabs>
  );
}
export default DashboardTabs;
