import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
interface SkeletonCircleProps { size?: number; }
export const SkeletonCircle = memo(function SkeletonCircle({ size = 40 }: SkeletonCircleProps) {
  return <Skeleton className="rounded-full" style={{ width: size, height: size }} />;
});
