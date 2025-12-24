import { memo } from "react";
import { CardContent } from "@/components/ui/card";
interface CardBodyProps { children: React.ReactNode; className?: string; }
export const CardBody = memo(function CardBody({ children, className }: CardBodyProps) {
  return <CardContent className={className}>{children}</CardContent>;
});
