import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
interface SkeletonBoxProps { width?: string; height?: string; className?: string; }
export const SkeletonBox = memo(function SkeletonBox({ width = "100%", height = "100px", className }: SkeletonBoxProps) {
  return <Skeleton className={cn("rounded-lg", className)} style={{ width, height }} />;
});
