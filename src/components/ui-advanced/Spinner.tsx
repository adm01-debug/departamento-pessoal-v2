import React from "react";
import { Card, CardContent } from "@/components/ui/card";
export interface SpinnerProps { className?: string; children?: React.ReactNode; }
export function Spinner({ className, children }: SpinnerProps) { return <div className={className}>{children || "Spinner Component"}</div>; }
export default Spinner;
