import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonCardProps { hasHeader?: boolean; lines?: number; className?: string; }

export function SkeletonCard({ hasHeader = true, lines = 3, className }: SkeletonCardProps) {
  return (
    <Card className={className}>
      {hasHeader && <CardHeader><Skeleton className="h-5 w-1/3" /></CardHeader>}
      <CardContent className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => <Skeleton key={i} className={cn("h-4", i === lines - 1 ? "w-2/3" : "w-full")} />)}
      </CardContent>
    </Card>
  );
}
export default SkeletonCard;
