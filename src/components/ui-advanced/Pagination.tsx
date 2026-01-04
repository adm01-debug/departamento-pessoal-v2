import React from "react";
import { Card, CardContent } from "@/components/ui/card";
export interface PaginationProps { className?: string; children?: React.ReactNode; }
export function Pagination({ className, children }: PaginationProps) { return <div className={className}>{children || "Pagination Component"}</div>; }
export default Pagination;
