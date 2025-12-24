import { memo } from "react";
import { AccordionContent as AC } from "@/components/ui/accordion";
interface AccordionContentProps { children: React.ReactNode; className?: string; }
export const AccordionContent = memo(function AccordionContent({ children, className }: AccordionContentProps) {
  return <AC className={className}>{children}</AC>;
});
