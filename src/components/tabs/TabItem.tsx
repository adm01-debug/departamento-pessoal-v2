import { memo } from "react";
import { TabsTrigger } from "@/components/ui/tabs";
interface TabItemProps { value: string; label: string; icon?: React.ReactNode; badge?: number; }
export const TabItem = memo(function TabItem({ value, label, icon, badge }: TabItemProps) {
  return (
    <TabsTrigger value={value} className="flex items-center gap-2">
      {icon}{label}{badge !== undefined && badge > 0 && <span className="bg-primary/20 text-primary text-xs px-1.5 rounded-full">{badge}</span>}
    </TabsTrigger>
  );
});
