import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsCardProps {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
  tabsClassName?: string;
}

export function TabsCard({ tabs, defaultValue, className, tabsClassName }: TabsCardProps) {
  return (
    <Card className={className}>
      <Tabs defaultValue={defaultValue || tabs[0]?.value}>
        <CardHeader className="pb-0">
          <TabsList className={cn("w-full justify-start", tabsClassName)}>
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} disabled={tab.disabled} className="gap-2">
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </CardHeader>
        <CardContent className="pt-4">
          {tabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value} className="m-0">
              {tab.content}
            </TabsContent>
          ))}
        </CardContent>
      </Tabs>
    </Card>
  );
}
export default TabsCard;
