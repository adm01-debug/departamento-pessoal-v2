import { memo } from "react";
import { Badge } from "@/components/ui/badge";
interface NavBadgeProps { count: number; variant?: "default" | "secondary" | "destructive"; }
export const NavBadge = memo(function NavBadge({ count, variant = "secondary" }: NavBadgeProps) {
  if (count <= 0) return null;
  return <Badge variant={variant} className="ml-auto text-xs">{count > 99 ? "99+" : count}</Badge>;
});
