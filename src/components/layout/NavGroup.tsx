import { memo } from "react";
interface NavGroupProps { label: string; children: React.ReactNode; }
export const NavGroup = memo(function NavGroup({ label, children }: NavGroupProps) {
  return <div className="space-y-1"><p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">{label}</p>{children}</div>;
});
