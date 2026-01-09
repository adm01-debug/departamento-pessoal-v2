import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Award } from "lucide-react";

interface Anniversary { name: string; years: number; date: string; department?: string; avatar?: string; isToday?: boolean; }
interface AnniversaryListProps { anniversaries: Anniversary[]; className?: string; }

export function AnniversaryList({ anniversaries, className }: AnniversaryListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {anniversaries.map((ann, i) => (
        <div key={i} className={cn("flex items-center gap-3 p-3 rounded-lg", ann.isToday ? "bg-yellow-50 border border-yellow-200" : "border")}>
          <Avatar><AvatarImage src={ann.avatar} /><AvatarFallback>{ann.name[0]}</AvatarFallback></Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2"><p className="font-medium">{ann.name}</p>{ann.isToday && <Badge className="bg-yellow-500">Hoje! 🎉</Badge>}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Award className="h-3 w-3" />{ann.years} {ann.years === 1 ? "ano" : "anos"}</span>
              <span>• {ann.date}</span>
              {ann.department && <span>• {ann.department}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default AnniversaryList;
