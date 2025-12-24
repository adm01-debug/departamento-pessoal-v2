import { memo } from "react";
import { Badge } from "@/components/ui/badge";
interface CountBadgeProps { count: number; max?: number; variant?: "default" | "secondary" | "destructive"; }
export const CountBadge = memo(function CountBadge({ count, max = 99, variant = "default" }: CountBadgeProps) {
  if (count <= 0) return null;
  const display = count > max ? `${max}+` : String(count);
  return <Badge variant={variant} className="h-5 min-w-[20px] px-1.5">{display}</Badge>;
});
