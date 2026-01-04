import React from "react";
import { Card, CardContent } from "@/components/ui/card";
export interface AlertProps { className?: string; children?: React.ReactNode; }
export function Alert({ className, children }: AlertProps) { return <div className={className}>{children || "Alert Component"}</div>; }
export default Alert;
