import { memo } from "react";
import { Badge } from "@/components/ui/badge";
interface BadgeContainerProps { children: React.ReactNode; variant?: "default" | "secondary" | "destructive" | "outline"; }
export const BadgeContainer = memo(function BadgeContainer({ children, variant = "default" }: BadgeContainerProps) {
  return <Badge variant={variant}>{children}</Badge>;
});
