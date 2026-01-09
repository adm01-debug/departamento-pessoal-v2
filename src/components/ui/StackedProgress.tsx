import React from "react";
import { cn } from "@/lib/utils";

interface SegmentItem { value: number; color: string; label?: string; }
interface StackedProgressProps { segments: SegmentItem[]; total?: number; height?: number; showLegend?: boolean; className?: string; }

export function StackedProgress({ segments, total, height = 8, showLegend = true, className }: StackedProgressProps) {
  const sum = total || segments.reduce((acc, s) => acc + s.value, 0);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex rounded-full overflow-hidden" style={{ height }}>
        {segments.map((seg, i) => <div key={i} className="transition-all" style={{ width: `${(seg.value / sum) * 100}%`, backgroundColor: seg.color }} />)}
      </div>
      {showLegend && (
        <div className="flex flex-wrap gap-4">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="text-sm">{seg.label || `Seg ${i + 1}`}</span>
              <span className="text-sm font-medium">{((seg.value / sum) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default StackedProgress;
