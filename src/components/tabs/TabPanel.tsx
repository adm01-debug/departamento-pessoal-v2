import { memo } from "react";
interface TabPanelProps { children: React.ReactNode; className?: string; }
export const TabPanel = memo(function TabPanel({ children, className }: TabPanelProps) {
  return <div className={className}>{children}</div>;
});
