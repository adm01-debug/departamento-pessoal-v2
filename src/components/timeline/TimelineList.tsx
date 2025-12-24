import { memo } from "react";
interface TimelineListProps { children: React.ReactNode; }
export const TimelineList = memo(function TimelineList({ children }: TimelineListProps) {
  return <div className="space-y-0">{children}</div>;
});
