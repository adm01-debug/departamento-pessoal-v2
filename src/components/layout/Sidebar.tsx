import { memo } from "react";
interface SidebarProps { children: React.ReactNode; className?: string; }
export const Sidebar = memo(function Sidebar({ children, className }: SidebarProps) {
  return <aside className={className || "w-64 border-r bg-background h-full p-4"}>{children}</aside>;
});
