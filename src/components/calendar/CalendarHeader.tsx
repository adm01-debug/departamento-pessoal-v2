import { memo } from "react";
const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const CalendarHeader = memo(function CalendarHeader() {
  return (
    <div className="grid grid-cols-7 gap-1 mb-2">
      {dias.map(d => <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>)}
    </div>
  );
});
