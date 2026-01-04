import React from "react";
import { Card, CardContent } from "@/components/ui/card";
export interface DrawerProps { className?: string; children?: React.ReactNode; }
export function Drawer({ className, children }: DrawerProps) { return <div className={className}>{children || "Drawer Component"}</div>; }
export default Drawer;
