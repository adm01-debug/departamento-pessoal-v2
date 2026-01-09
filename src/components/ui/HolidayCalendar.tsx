import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

interface Holiday { date: string; name: string; type: "nacional" | "estadual" | "municipal" | "facultativo"; }
interface HolidayCalendarProps { holidays: Holiday[]; className?: string; }

const typeColors = { nacional: "bg-green-500", estadual: "bg-blue-500", municipal: "bg-purple-500", facultativo: "bg-yellow-500" };

export function HolidayCalendar({ holidays, className }: HolidayCalendarProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {holidays.map((holiday, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
          <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center"><Calendar className="h-5 w-5 text-primary" /></div>
          <div className="flex-1">
            <div className="flex items-center gap-2"><p className="font-medium">{holiday.name}</p><Badge className={typeColors[holiday.type]}>{holiday.type}</Badge></div>
            <p className="text-sm text-muted-foreground">{holiday.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
export default HolidayCalendar;
