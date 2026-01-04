import React from "react";
import { Circle, CheckCircle } from "lucide-react";
interface TimelineItem { id: string; title: string; description?: string; date: string; status?: "completed" | "current" | "pending"; icon?: React.ReactNode; }
interface Props { items: TimelineItem[]; }
export function Timeline({ items }: Props) {
  return (<div className="relative">{items.map((item, i) => (<div key={item.id} className="flex gap-4 pb-8 last:pb-0"><div className="relative flex flex-col items-center"><div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.status === "completed" ? "bg-green-500 text-white" : item.status === "current" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>{item.icon || (item.status === "completed" ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />)}</div>{i < items.length - 1 && <div className="w-0.5 h-full bg-gray-200 absolute top-8" />}</div><div className="flex-1 pb-4"><p className="font-medium">{item.title}</p>{item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}<p className="text-xs text-muted-foreground mt-1">{item.date}</p></div></div>))}</div>);
}
export default Timeline;
