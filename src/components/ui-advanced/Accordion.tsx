import React from "react";
import { Card, CardContent } from "@/components/ui/card";
export interface AccordionProps { className?: string; children?: React.ReactNode; }
export function Accordion({ className, children }: AccordionProps) { return <div className={className}>{children || "Accordion Component"}</div>; }
export default Accordion;
