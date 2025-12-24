import { memo } from "react";
import { TabsList } from "@/components/ui/tabs";
interface TabListProps { children: React.ReactNode; className?: string; }
export const TabList = memo(function TabList({ children, className }: TabListProps) {
  return <TabsList className={className}>{children}</TabsList>;
});
