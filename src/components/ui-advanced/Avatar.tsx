import React from "react";
import { Card, CardContent } from "@/components/ui/card";
export interface AvatarProps { className?: string; children?: React.ReactNode; }
export function Avatar({ className, children }: AvatarProps) { return <div className={className}>{children || "Avatar Component"}</div>; }
export default Avatar;
