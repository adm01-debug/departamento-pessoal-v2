import { memo } from "react";
import { Accordion } from "@/components/ui/accordion";
interface AccordionContainerProps { children: React.ReactNode; type?: "single" | "multiple"; defaultValue?: string; }
export const AccordionContainer = memo(function AccordionContainer({ children, type = "single", defaultValue }: AccordionContainerProps) {
  return <Accordion type={type} defaultValue={defaultValue} collapsible>{children}</Accordion>;
});
