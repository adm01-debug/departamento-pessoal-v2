import React from "react";
import { cn } from "@/lib/utils";

interface DashboardGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: "sm" | "md" | "lg";
  className?: string;
  responsive?: boolean;
}

const colClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
};

const gapClasses = { sm: "gap-2", md: "gap-4", lg: "gap-6" };

export function DashboardGrid({ children, cols = 4, gap = "md", className, responsive = true }: DashboardGridProps) {
  return (
    <div className={cn("grid", responsive ? colClasses[cols] : `grid-cols-${cols}`, gapClasses[gap], className)}>
      {children}
    </div>
  );
}

interface DashboardGridItemProps {
  children: React.ReactNode;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6;
  rowSpan?: 1 | 2 | 3;
  className?: string;
}

export function DashboardGridItem({ children, colSpan = 1, rowSpan = 1, className }: DashboardGridItemProps) {
  const spanClass = colSpan > 1 ? `md:col-span-${colSpan}` : "";
  const rowClass = rowSpan > 1 ? `row-span-${rowSpan}` : "";
  return <div className={cn(spanClass, rowClass, className)}>{children}</div>;
}

export default DashboardGrid;
