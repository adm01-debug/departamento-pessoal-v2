import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
interface SkeletonTextProps { lines?: number; }
export const SkeletonText = memo(function SkeletonText({ lines = 3 }: SkeletonTextProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => <Skeleton key={i} className="h-4" style={{ width: `${100 - i * 15}%` }} />)}
    </div>
  );
});
