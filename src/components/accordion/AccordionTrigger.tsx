import { memo } from "react";
import { AccordionTrigger as AT } from "@/components/ui/accordion";
interface AccordionTriggerProps { children: React.ReactNode; className?: string; }
export const AccordionTrigger = memo(function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  return <AT className={className}>{children}</AT>;
});
