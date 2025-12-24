import { memo } from "react";
import { CardTitle as CT } from "@/components/ui/card";
interface CardTitleProps { children: React.ReactNode; }
export const CardTitle = memo(function CardTitle({ children }: CardTitleProps) {
  return <CT>{children}</CT>;
});
