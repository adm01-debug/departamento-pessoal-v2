import React from "react";
import { Card, CardContent } from "@/components/ui/card";
export interface SkeletonProps { className?: string; children?: React.ReactNode; }
export function Skeleton({ className, children }: SkeletonProps) { return <div className={className}>{children || "Skeleton Component"}</div>; }
export default Skeleton;
