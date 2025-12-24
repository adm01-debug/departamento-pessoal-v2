import { memo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
interface CalendarNavProps { mesAno: string; onPrev: () => void; onNext: () => void; }
export const CalendarNav = memo(function CalendarNav({ mesAno, onPrev, onNext }: CalendarNavProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button variant="ghost" size="icon" onClick={onPrev}><ChevronLeft className="h-4 w-4" /></Button>
      <span className="font-medium">{mesAno}</span>
      <Button variant="ghost" size="icon" onClick={onNext}><ChevronRight className="h-4 w-4" /></Button>
    </div>
  );
});
