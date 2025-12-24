import { memo } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
interface TrendProps { direction: "up" | "down"; value: number; }
export const Trend = memo(function Trend({ direction, value }: TrendProps) {
  const Icon = direction === "up" ? ArrowUp : ArrowDown;
  const color = direction === "up" ? "text-green-600" : "text-red-600";
  return <span className={`inline-flex items-center gap-1 text-sm ${color}`}><Icon className="h-4 w-4" />{value}%</span>;
});
