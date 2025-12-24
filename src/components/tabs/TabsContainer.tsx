import { memo } from "react";
import { Tabs } from "@/components/ui/tabs";
interface TabsContainerProps { children: React.ReactNode; defaultValue: string; className?: string; onValueChange?: (v: string) => void; }
export const TabsContainer = memo(function TabsContainer({ children, defaultValue, className, onValueChange }: TabsContainerProps) {
  return <Tabs defaultValue={defaultValue} className={className} onValueChange={onValueChange}>{children}</Tabs>;
});
