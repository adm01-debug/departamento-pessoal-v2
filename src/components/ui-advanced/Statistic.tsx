import React from "react";
import { Card, CardContent } from "@/components/ui/card";
export interface StatisticProps { className?: string; children?: React.ReactNode; }
export function Statistic({ className, children }: StatisticProps) { return <div className={className}>{children || "Statistic Component"}</div>; }
export default Statistic;
