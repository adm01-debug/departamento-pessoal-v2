import React from "react";
import { cn } from "@/lib/utils";

interface GridPatternProps {
  width?: number;
  height?: number;
  strokeWidth?: number;
  className?: string;
}

export function GridPattern({ width = 40, height = 40, strokeWidth = 1, className }: GridPatternProps) {
  const id = React.useId();
  return (
    <svg className={cn("absolute inset-0 h-full w-full", className)}>
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse">
          <path d={`M ${width} 0 L 0 0 0 ${height}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-muted-foreground/20" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
export default GridPattern;
