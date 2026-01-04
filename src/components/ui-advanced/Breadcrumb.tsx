import React from "react";
import { Card, CardContent } from "@/components/ui/card";
export interface BreadcrumbProps { className?: string; children?: React.ReactNode; }
export function Breadcrumb({ className, children }: BreadcrumbProps) { return <div className={className}>{children || "Breadcrumb Component"}</div>; }
export default Breadcrumb;
