import { memo } from "react";
import { Badge } from "@/components/ui/badge";
interface BadgeContainerProps { children: React.ReactNode; variant?: "default" | "secondary" | "destructive" | "outline"; className?: string; }
export const BadgeContainer = memo(function BadgeContainer({ children, variant = "default", className }: BadgeContainerProps) {
  return <Badge variant={variant} className={className}>{children}</Badge>;
});
