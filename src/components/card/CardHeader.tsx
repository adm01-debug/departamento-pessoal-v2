import { memo } from "react";
import { CardHeader as CH } from "@/components/ui/card";
interface CardHeaderProps { children: React.ReactNode; className?: string; }
export const CardHeader = memo(function CardHeader({ children, className }: CardHeaderProps) {
  return <CH className={className}>{children}</CH>;
});
