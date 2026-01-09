import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, FileText, Send } from "lucide-react";

interface PayrollEvent { date: string; type: "fechamento" | "pagamento" | "guias" | "esocial"; label: string; }
interface PayrollCalendarProps { events: PayrollEvent[]; className?: string; }

const icons = { fechamento: FileText, pagamento: DollarSign, guias: Send, esocial: Calendar };
const colors = { fechamento: "bg-blue-500", pagamento: "bg-green-500", guias: "bg-yellow-500", esocial: "bg-purple-500" };

export function PayrollCalendar({ events, className }: PayrollCalendarProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {events.map((event, i) => {
        const Icon = icons[event.type];
        return (
          <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
            <div className={cn("h-10 w-10 rounded flex items-center justify-center text-white", colors[event.type])}><Icon className="h-5 w-5" /></div>
            <div className="flex-1"><p className="font-medium">{event.label}</p><p className="text-sm text-muted-foreground">{event.date}</p></div>
            <Badge variant="outline">{event.type}</Badge>
          </div>
        );
      })}
    </div>
  );
}
export default PayrollCalendar;
