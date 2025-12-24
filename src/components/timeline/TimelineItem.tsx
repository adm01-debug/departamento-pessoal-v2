import { memo } from "react";
import { cn } from "@/lib/utils";
interface TimelineItemProps { titulo: string; descricao?: string; data: string; icone?: React.ReactNode; isLast?: boolean; }
export const TimelineItem = memo(function TimelineItem({ titulo, descricao, data, icone, isLast }: TimelineItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">{icone}</div>
        {!isLast && <div className="w-0.5 flex-1 bg-border mt-2" />}
      </div>
      <div className={cn("pb-6", isLast && "pb-0")}>
        <p className="font-medium">{titulo}</p>
        {descricao && <p className="text-sm text-muted-foreground">{descricao}</p>}
        <p className="text-xs text-muted-foreground mt-1">{data}</p>
      </div>
    </div>
  );
});
