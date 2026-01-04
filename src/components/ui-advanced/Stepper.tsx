import React from "react";
import { Card, CardContent } from "@/components/ui/card";
export interface StepperProps { className?: string; children?: React.ReactNode; }
export function Stepper({ className, children }: StepperProps) { return <div className={className}>{children || "Stepper Component"}</div>; }
export default Stepper;
