import React from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideIcon } from "lucide-react";

interface TabItem { value: string; label: string; icon?: LucideIcon; count?: number; }
interface TabNavigationProps { tabs: TabItem[]; value: string; onChange: (value: string) => void; className?: string; }

export function TabNavigation({ tabs, value, onChange, className }: TabNavigationProps) {
  return (
    <Tabs value={value} onValueChange={onChange} className={className}>
      <TabsList>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
              {Icon && <Icon className="h-4 w-4" />}
              {tab.label}
              {tab.count !== undefined && <span className="ml-1 px-1.5 py-0.5 bg-muted rounded-full text-xs">{tab.count}</span>}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
export default TabNavigation;
