import React from "react";
import { cn } from "@/lib/utils";

interface NumberCounterProps { value: number; prefix?: string; suffix?: string; duration?: number; className?: string; }

export function NumberCounter({ value, prefix = "", suffix = "", duration = 1000, className }: NumberCounterProps) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => { start += step; if (start >= value) { setCount(value); clearInterval(timer); } else { setCount(Math.floor(start)); } }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span className={className}>{prefix}{count.toLocaleString("pt-BR")}{suffix}</span>;
}
export default NumberCounter;
