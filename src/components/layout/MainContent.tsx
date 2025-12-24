import { memo } from "react";
interface MainContentProps { children: React.ReactNode; className?: string; }
export const MainContent = memo(function MainContent({ children, className }: MainContentProps) {
  return <main className={className || "flex-1 p-6 overflow-auto"}>{children}</main>;
});
