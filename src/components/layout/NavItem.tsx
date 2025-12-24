import { memo } from "react";
import { cn } from "@/lib/utils";
interface NavItemProps { label: string; href: string; icon?: React.ReactNode; active?: boolean; }
export const NavItem = memo(function NavItem({ label, href, icon, active }: NavItemProps) {
  return <a href={href} className={cn("flex items-center gap-2 px-3 py-2 text-sm rounded-lg", active ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>{icon}{label}</a>;
});
