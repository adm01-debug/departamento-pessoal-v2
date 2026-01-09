import React from "react";
import { cn } from "@/lib/utils";

interface DotPatternProps {
  width?: number;
  height?: number;
  radius?: number;
  className?: string;
}

export function DotPattern({ width = 16, height = 16, radius = 1, className }: DotPatternProps) {
  const id = React.useId();
  return (
    <svg className={cn("absolute inset-0 h-full w-full", className)}>
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse">
          <circle cx={width / 2} cy={height / 2} r={radius} fill="currentColor" className="text-muted-foreground/30" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
export default DotPattern;
