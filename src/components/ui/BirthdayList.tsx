import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Cake } from "lucide-react";

interface Birthday { name: string; date: string; department?: string; avatar?: string; isToday?: boolean; }
interface BirthdayListProps { birthdays: Birthday[]; className?: string; }

export function BirthdayList({ birthdays, className }: BirthdayListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {birthdays.map((bday, i) => (
        <div key={i} className={cn("flex items-center gap-3 p-3 rounded-lg", bday.isToday ? "bg-primary/10 border border-primary/20" : "border")}>
          <Avatar><AvatarImage src={bday.avatar} /><AvatarFallback>{bday.name[0]}</AvatarFallback></Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2"><p className="font-medium">{bday.name}</p>{bday.isToday && <Badge className="bg-primary">Hoje! 🎂</Badge>}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Cake className="h-3 w-3" />{bday.date}</span>
              {bday.department && <span>• {bday.department}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default BirthdayList;
