import React from "react";
import { cn } from "@/lib/utils";
interface ContentLayoutProps { children: React.ReactNode; className?: string; }
export function ContentLayout({ children, className }: ContentLayoutProps) {
  return <div className={cn("container mx-auto p-6 space-y-6", className)}>{children}</div>;
}
export function ContentSection({ children, className }: ContentLayoutProps) {
  return <section className={cn("space-y-4", className)}>{children}</section>;
}
export function ContentGrid({ children, className, cols = 4 }: ContentLayoutProps & { cols?: number }) {
  const gridCols = { 1: "grid-cols-1", 2: "grid-cols-1 md:grid-cols-2", 3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", 4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" };
  return <div className={cn("grid gap-4", gridCols[cols as keyof typeof gridCols] || gridCols[4], className)}>{children}</div>;
}
export default ContentLayout;
