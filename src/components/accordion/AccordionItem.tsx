import { memo } from "react";
import { AccordionItem as AI } from "@/components/ui/accordion";
interface AccordionItemProps { value: string; children: React.ReactNode; className?: string; }
export const AccordionItem = memo(function AccordionItem({ value, children, className }: AccordionItemProps) {
  return <AI value={value} className={className}>{children}</AI>;
});
