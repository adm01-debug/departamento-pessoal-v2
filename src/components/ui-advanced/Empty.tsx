import React from "react";
import { Card, CardContent } from "@/components/ui/card";
export interface EmptyProps { className?: string; children?: React.ReactNode; }
export function Empty({ className, children }: EmptyProps) { return <div className={className}>{children || "Empty Component"}</div>; }
export default Empty;
