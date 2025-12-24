import { memo } from "react";
import { TabsContent } from "@/components/ui/tabs";
interface TabContentProps { value: string; children: React.ReactNode; className?: string; }
export const TabContent = memo(function TabContent({ value, children, className }: TabContentProps) {
  return <TabsContent value={value} className={className}>{children}</TabsContent>;
});
