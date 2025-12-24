import { memo } from "react";
import { Accordion } from "@/components/ui/accordion";
interface AccordionContainerProps { children: React.ReactNode; type?: "single" | "multiple"; defaultValue?: string; className?: string; }
export const AccordionContainer = memo(function AccordionContainer({ children, type = "single", defaultValue, className }: AccordionContainerProps) {
  return <Accordion type={type} defaultValue={defaultValue} className={className} collapsible>{children}</Accordion>;
});
