import React from "react";
import { Card, CardContent } from "@/components/ui/card";
export interface TooltipProps { className?: string; children?: React.ReactNode; }
export function Tooltip({ className, children }: TooltipProps) { return <div className={className}>{children || "Tooltip Component"}</div>; }
export default Tooltip;
