import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
export const SkeletonCard = memo(function SkeletonCard() {
  return (
    <Card>
      <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
      <CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardContent>
    </Card>
  );
});
