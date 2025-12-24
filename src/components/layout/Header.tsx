import { memo } from "react";
interface HeaderProps { children: React.ReactNode; className?: string; }
export const Header = memo(function Header({ children, className }: HeaderProps) {
  return <header className={className || "h-16 border-b flex items-center px-4"}>{children}</header>;
});
