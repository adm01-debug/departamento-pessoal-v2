import React from "react";
import { Card, CardContent } from "@/components/ui/card";
export interface ResultProps { className?: string; children?: React.ReactNode; }
export function Result({ className, children }: ResultProps) { return <div className={className}>{children || "Result Component"}</div>; }
export default Result;
