import { memo } from "react";
import { CardDescription as CD } from "@/components/ui/card";
interface CardDescriptionProps { children: React.ReactNode; }
export const CardDescription = memo(function CardDescription({ children }: CardDescriptionProps) {
  return <CD>{children}</CD>;
});
