import { memo } from "react";
import { CardFooter as CF } from "@/components/ui/card";
interface CardFooterProps { children: React.ReactNode; className?: string; }
export const CardFooter = memo(function CardFooter({ children, className }: CardFooterProps) {
  return <CF className={className}>{children}</CF>;
});
