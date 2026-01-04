import React from "react";
import { Card, CardContent } from "@/components/ui/card";
export interface TagProps { className?: string; children?: React.ReactNode; }
export function Tag({ className, children }: TagProps) { return <div className={className}>{children || "Tag Component"}</div>; }
export default Tag;
