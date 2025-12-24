import { memo } from "react";
import { AccordionItem as AI } from "@/components/ui/accordion";
interface AccordionItemProps { value: string; children: React.ReactNode; }
export const AccordionItem = memo(function AccordionItem({ value, children }: AccordionItemProps) {
  return <AI value={value}>{children}</AI>;
});
